//Importar el Modelo de Area
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js"
import TurnoModel from "../models/TurnoModel.js";
import FolioModel from "../models/FolioModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllTurnosPendientes = async (req, res) => {
    try {
        const turnos = await TurnoModel.findAll({
            where: { estatus: ["Pendiente", "Atendiendo"] },
            include: {
                model: AreaModel,
                attributes: ["nombre_area"]
            }, order: [['update_at', 'DESC']]
        });

        const TurnosInfo = await Promise.all(turnos.map(async function (turno) {
            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: turno.fk_idarea
                },
                attributes: ["nombre_area"]
            })

            var cajaNombre = ""
            if (turno.fk_idcaja == null) {
                cajaNombre = "En espera"
            } else {
                const nombreDeCaja = await CajaModel.findOne({
                    where: {
                        estatus: true,
                        id: turno.fk_idcaja
                    },
                    attributes: ["nombre_caja"]
                })
                cajaNombre = nombreDeCaja.nombre_caja
            }

            const FolioTurno = await FolioModel.findOne({
                where: {
                    fk_idturno: turno.id
                },
                attributes: ["numero_folio"]
            })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: turno.id,
                nombre_area: areaNombre.nombre_area,
                create_at: turno.create_at,
                estatus: turno.estatus,
                nombre_caja: cajaNombre,
                folio: FolioTurno.numero_folio
            }
        }

        ))
        res.json(TurnosInfo)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getTurno = async (req, res) => {
    //Recibir la lista de turnos y buscar los turnos pertenecientes a esas áreas
    try {
        const turnosPorArea = await TurnoModel.findAll({
            where: {
                fk_idarea: req.body.lista,
                estatus: "Pendiente"
            },
            include: {
                model: AreaModel,
                attributes: ["nombre_area", "create_at"]
            }
        })
        // Ordenar los turnos por create_at (fecha de creación)
        const sortedTurnosPorArea = turnosPorArea.sort((a, b) => {
            return new Date(a.create_at) - new Date(b.create_at);
        });
        const TurnosPorAreaInfo = await Promise.all(sortedTurnosPorArea.map(async function (turno) {

            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: turno.fk_idarea
                },
                attributes: ["nombre_area"]
            })

            const FolioTurno = await FolioModel.findOne({
                where: {
                    fk_idturno: turno.id
                },
                attributes: ["numero_folio"]
            })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: turno.id,
                nombre_area: areaNombre.nombre_area,
                create_at: turno.create_at,
                estatus: turno.estatus,
                folio: FolioTurno.numero_folio
            }
        }));
        res.json(TurnosPorAreaInfo)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Mostrar si hay un turno atendido
export const getTurnoAtendiendo = async (req, res) => {

    try {
        const turnoAtendiendo = await TurnoModel.findOne({
            where: {
                update_by: req.params.usuario,
                estatus: "Atendiendo"
            }
        })

        if (turnoAtendiendo != null) {
            const FolioTurno = await FolioModel.findOne({
                where: {
                    fk_idturno: turnoAtendiendo.id
                },
                attributes: ["numero_folio"]
            })

            res.json({
                id: turnoAtendiendo.id,
                folio: FolioTurno.numero_folio,
                fk_idarea: turnoAtendiendo.fk_idarea,
                fk_idcaja: turnoAtendiendo.fk_idcaja
            })
        } else {
            res.json(turnoAtendiendo)
        }


    } catch (error) {
        res.json({ message: error.message })
        await transaction.rollback();
    }
}

export const getTurnoSiguiente = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const turnoAtendiendo = await TurnoModel.findOne({
            where: {
                estatus: ["Atendiendo", "Pendiente"]
            },
            order: [['update_at', 'DESC']] // Ordenar por update_at en orden descendente
        }, { transaction: transaction });

        //Información de la tabla Areas
        const areaNombre = await AreaModel.findOne({
            where: {
                estatus: true,
                id: turnoAtendiendo.fk_idarea
            },
            attributes: ["nombre_area"]
        }, { transaction: transaction })

        //Información de la tabla Caja
        const cajaNombre = await CajaModel.findOne({
            where: {
                estatus: true,
                id: turnoAtendiendo.fk_idcaja
            },
            attributes: ["nombre_caja", "id"]
        }, { transaction: transaction })

        const FolioTurno = await FolioModel.findOne({
            where: {
                fk_idturno: turnoAtendiendo.id
            },
            attributes: ["numero_folio"]
        }, { transaction: transaction })

        res.json({
            id: turnoAtendiendo.id,
            nombre_area: areaNombre.nombre_area,
            nombre_caja: cajaNombre.nombre_caja,
            caja_id: cajaNombre.id,
            folio: FolioTurno.numero_folio
        });
        await transaction.commit();
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
};

//Crear un registro
export const createTurno = async (req, res) => {
    const transaction = await db.transaction();
    try {
        var NumeroFolio;
        // Crea el turno y obtiene el ID del nuevo turno
        const nuevoTurno = await TurnoModel.create(req.body, { transaction: transaction });

        // Crea el folio, primero verifica si hay un folio anterior y se le suma 1 su numero de folio
        const ultimoFolioCreado = await FolioModel.findOne({
            attributes: ["numero_folio"],
            order: [['create_at', 'DESC']]
        }, { transaction: transaction });

        if (ultimoFolioCreado != null) {
            NumeroFolio = ultimoFolioCreado.numero_folio + 1;
        } else {
            NumeroFolio = 1;
        }

        // Usa el ID del nuevo turno creado
        await FolioModel.create({
            numero_folio: NumeroFolio,
            estatus: true,
            create_by: req.body.create_by,
            fk_idturno: nuevoTurno.id
        }, { transaction: transaction });

        await transaction.commit();
        res.json({
            "message": "Registro creado correctamente"
        });
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message });
    }
}

//Cambiar el estado a "Atendiendo"
export const updateTurnoAtendiendo = async (req, res) => {
    try {
        let fechaUpdate = new Date();
        const formatoFechaUpdate = fechaUpdate.toISOString();
        await TurnoModel.update({
            estatus: req.body.estatus,
            turno_seleccionado: formatoFechaUpdate,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate,
            fk_idcaja: req.body.fk_idcaja
        }, {
            where: { id: req.params.id }
        })
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Cambiar el estado a "Finalizado"
export const updateTurnoFinalizado = async (req, res) => {
    try {
        let fechaUpdate = new Date();
        const formatoFechaUpdate = fechaUpdate.toISOString();
        await TurnoModel.update({
            estatus: req.body.estatus,
            turno_atendido: formatoFechaUpdate,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate,
        }, {
            where: { id: req.params.id }
        })
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

