//Importar el Modelo de Area
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js"
import TurnoModel from "../models/TurnoModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllTurnosPendientes = async (req, res) => {
    try {
        const turnos = await TurnoModel.findAll({
            where: {
                estatus: "pendiente",
            },
            include: {
                model: AreaModel,
                attributes: ["nombre_area"]
            }
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

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: turno.id,
                nombre_area: areaNombre.nombre_area,
                create_at: turno.create_at,
                estatus: turno.estatus
            }
        }))
        res.json(TurnosInfo)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getTurno = async (req, res) => {
    try {
        const turnosPorArea = await TurnoModel.findAll({
            where: {
                fk_idarea: req.params.id,
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

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: turno.id,
                nombre_area: areaNombre.nombre_area,
                create_at: turno.create_at,
                estatus: turno.estatus
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
                fk_idarea: req.params.id,
                update_by: req.params.usuario,
                estatus: "Atendiendo"
            }
        })

        res.json(turnoAtendiendo)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getTurnoSiguiente = async (req, res) => {
    try {
        const turnoAtendiendo = await TurnoModel.findOne({
            where: {
                estatus: "Atendiendo"
            },
            order: [['update_at', 'DESC']] // Ordenar por update_at en orden descendente
        });

        //Información de la tabla Areas
        const areaNombre = await AreaModel.findOne({
            where: {
                estatus: true,
                id: turnoAtendiendo.fk_idarea
            },
            attributes: ["nombre_area"]
        })

        //Información de la tabla Caja
        const cajaNombre = await CajaModel.findOne({
            where: {
                estatus: true,
                id: turnoAtendiendo.fk_idcaja
            },
            attributes: ["nombre_caja", "id"]
        })

        res.json({
            turno_id: turnoAtendiendo.id,
            nombre_area: areaNombre.nombre_area,
            nombre_caja: cajaNombre.nombre_caja,
            caja_id: cajaNombre.id
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

//Crear un registro
export const createTurno = async (req, res) => {
    try {
        await TurnoModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updateTurno = async (req, res) => {
    try {
        await TurnoModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}
