//Importar el Modelo de Caja
import CajaModel from "../models/CajaModel.js";
import AreaCajaModel from "../models/AreaCajaModel.js";
import CajaUsuarioModel from "../models/CajaUsuarioModel.js";
import TurnoModel from "../models/TurnoModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllCajas = async (req, res) => {
    try {
        const Cajas = await CajaModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre_caja"]
        });
        res.json(Cajas)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getCaja = async (req, res) => {
    try {
        const Caja = await CajaModel.findOne({
            where: { estatus: true, id: req.params.id },
            attributes: ["id", "nombre_caja"]

        })
        res.json(Caja)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createCaja = async (req, res) => {
    //Se implemetó las transacciones SQL para crear primero la caja 
    // y luego agregar su dato a la tabla AreaCajas
    const transaction = await db.transaction();
    try {
        //Primero se crea el registro en la tabla Cajas
        const Caja = await CajaModel.create(
            {
                nombre_caja: req.body.nombre_Caja, estatus: req.body.estatus,
                create_by: req.body.create_by
            }, { transaction: transaction })

        //Se guarda la lista de los ID Areas en una constante
        const ListaAreasId = req.body.areasID;
        //Se guarda el id de la caja en una constante
        const CajaId = Caja.id;

        // Se recorre la lista de areas y por cada id se crea un registro en la tabla AreaCajas
        await Promise.all(ListaAreasId.map(async function (areaID) {
            const nuevasAreaCajas = await AreaCajaModel.create(
                {
                    area_id: areaID,
                    caja_id: CajaId,
                    estatus: true
                }, { transaction: transaction }
            )
            return nuevasAreaCajas;
        })
        )
        //Se realiza el commit para verificar que se completen todas las consultas anteriores
        // y una vez completadas se guardan y ejecutan
        await transaction.commit();

        return res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        //En caso de algún fallo se cancelan las consultas en caso de haberse ejecutado algunas
        //y no se guardan los datos
        res.json({ message: error.message })
        await transaction.rollback();
    }
}

//Actualizar o modificar las areas de la caja
export const updateCaja = async (req, res) => {
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Primero se cambia el estatus a false  del registro de Caja
        await CajaModel.update({
            estatus: req.body.estatus,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
        }, { transaction: transaction })

        //Se buscan todos los registros que coincidan con la caja "eliminada"
        const AreasConCaja = await AreaCajaModel.findAll({
            where: { caja_id: req.params.id },
            attributes: ["id"]
        })
        const UsuarioConCaja = await CajaUsuarioModel.findAll({
            where: { cajas_id: req.params.id },
            attributes: ["id"]
        })

        const TurnoAtendiendo = await TurnoModel.findAll({
            where: {
                fk_idcaja: req.params.id,
                estatus: "Atendiendo"
            },
            attributes: ["id"]
        })

        //Si se encuentra un registro se elimina el registro
        if (AreasConCaja != null) {
            await Promise.all(AreasConCaja.map(async function (registro) {
                await AreaCajaModel.destroy({
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (UsuarioConCaja != null) {
            await Promise.all(UsuarioConCaja.map(async function (registro) {
                await CajaUsuarioModel.destroy({
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (TurnoAtendiendo != null) {
            await Promise.all(TurnoAtendiendo.map(async function (registro) {
                await TurnoModel.update({
                    estatus: "Pendiente",
                    update_by: req.body.update_by,
                    update_at: formatoFechaUpdate
                }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        await transaction.commit();
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message });
    }
}

//Actualizar o modificar el nombre de la caja
export const updateNombreCaja = async (req, res) => {
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        await CajaModel.update({
            nombre_caja: req.body.nombre_caja,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.body.caja_id }
        }, { transaction: transaction })

        await transaction.commit();
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message })
    }
}

//Eliminar un registro
export const deleteCaja = async (req, res) => {
    try {
        await CajaModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.json({
            "message": "Registro eliminado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}