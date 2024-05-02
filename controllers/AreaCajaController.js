//Importar el Modelo de Area
import AreaCajaModel from "../models/AreaCajaModel.js";
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllAreaCaja = async (req, res) => {
    const transaction = await db.transaction();
    try {
        //Obtener toda la info de la tabla AreaCaja
        const areasCajas = await AreaCajaModel.findAll({
            where: { estatus: true },
            attributes: ["id", "area_id", "caja_id"]
        }, { transaction: transaction });
        //Ciclo para modificar cada registro de la tabla areasCajas
        const InfoTotal = await Promise.all(areasCajas.map(async function (registro) {
            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.area_id
                },
                attributes: ["nombre_area"]
            }, { transaction: transaction })
            //Información de la tabla Cajas
            const cajaNombre = await CajaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.caja_id
                },
            }, { transaction: transaction })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: registro.id,
                area_id: registro.area_id,
                nombre_area: areaNombre.nombre_area,
                caja_id: registro.caja_id,
                nombre_caja: cajaNombre
            }
        }))
        await transaction.commit();
        res.json(InfoTotal)
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message })
    }
};

//Mostrar todas las areas de una caja
export const getAreaCaja = async (req, res) => {
    try {
        //Información de la tabla AreaCajas
        const areaCaja = await AreaCajaModel.findAll({
            where: { caja_id: req.params.caja_id, estatus: true },
        })
        const InfoTotal = await Promise.all(areaCaja.map(async function (registro) {
            const IDArea = registro.area_id
            return IDArea
        }))
        //Devolver un nuevo json que solo contenga el id del area
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createAreaCaja = async (req, res) => {
    try {
        await AreaCajaModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updateAreaCaja = async (req, res) => {
    const transaction = await db.transaction();
    const cajaId = req.body.caja_id

    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Aqui se elimine primero y luego se insertan los nuevos elementos
        //Eliminar los registros de la caja en la tabla AreaCajas
        await AreaCajaModel.destroy({
            where: {
                caja_id: cajaId
            }
        }, {
            transaction: transaction
        });
        const ListaAreasId = req.body.nuevasAreasMod
        await Promise.all(ListaAreasId.map(async function (areaID) {
            await AreaCajaModel.create(
                {
                    area_id: areaID,
                    caja_id: cajaId,
                    estatus: true
                }
            )
        }))

        //Ciclo para mostrar registro de la tabla areasCajas
        await CajaModel.update({
            update_by: req.body.update_by, update_at: formatoFechaUpdate
        }, {
            where: { id: cajaId }
        }, { transaction: transaction })

        await transaction.commit();
        //Información actualizada
        res.json({ message: "Se actualizó correctamente" })
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}

export const hideAreaCaja = async (req, res) => {
    try {
        await AreaCajaModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Eliminar un registro
export const deleteAreaCaja = async (req, res) => {
    try {
        await AreaCajaModel.put({
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

