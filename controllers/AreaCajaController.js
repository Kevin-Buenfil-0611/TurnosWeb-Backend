//Importar el Modelo de Area
import AreaCajaModel from "../models/AreaCajaModel.js";
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllAreaCaja = async (req, res) => {
    try {
        //Obtener toda la info de la tabla AreaCaja
        const areasCajas = await AreaCajaModel.findAll({
            where: { estatus: true },
            attributes: ["id", "area_id", "caja_id"]
        });

        //Ciclo para modificar cada registro de la tabla areasCajas
        const InfoTotal = await Promise.all(areasCajas.map(async function (registro) {

            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.area_id
                },
                attributes: ["nombre_area"]
            })
            //Información de la tabla Cajas
            const cajaNombre = await CajaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.caja_id
                },
                attributes: ["nombre_caja"]
            })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: registro.id,
                area_id: registro.area_id,
                nombre_area: areaNombre.nombre_area,
                caja_id: registro.caja_id,
                nombre_caja: cajaNombre.nombre_caja
            }
        }))
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar todas las cajas en la tabla AreaCajas
export const getAreaCaja = async (req, res) => {
    try {
        //Información de la tabla AreaCajas
        const areaCaja = await AreaCajaModel.findAll({
            where: { caja_id: req.params.caja_id, estatus: true },
        })

        res.json(areaCaja)
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
    try {
        //Aqui se elimine primero y luego se insertan los nuevos elementos
        //Eliminar los registros de la caja en la tabla AreaCajas
        await AreaCajaModel.destroy({
            where: {
                caja_id: req.body.caja_id
            }
        }, {
            transaction: transaction
        });

        await CajaModel.update({ nombre_caja: req.body.nombre_caja },
            {
                where: { id: req.body.caja_id },
                transaction: transaction
            })

        const ListaAreasId = req.body.areasMod
        await Promise.all(ListaAreasId.map(async function (areaID) {
            await AreaCajaModel.create(
                {
                    area_id: areaID,
                    caja_id: req.body.caja_id,
                    estatus: true
                }, { transaction: transaction }
            )
        }))
        await transaction.commit();

        //Actualizo la información una vez creado los nuevos campos y devuelvo un json con la informacion nueva
        const areasCajas = await AreaCajaModel.findAll({
            where: { estatus: true },
            attributes: ["id", "area_id", "caja_id"]
        });

        //Ciclo para mostrar registro de la tabla areasCajas
        const InfoTotal = await Promise.all(areasCajas.map(async function (registro) {
            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.area_id
                },
                attributes: ["nombre_area"]
            })
            //Información de la tabla Cajas
            const cajaNombre = await CajaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.caja_id
                },
                attributes: ["nombre_caja"]
            })
            return {
                id: registro.id,
                area_id: registro.area_id,
                nombre_area: areaNombre.nombre_area,
                caja_id: registro.caja_id,
                nombre_caja: cajaNombre.nombre_caja
            }
        }))
        await CajaModel.update({
            update_by: req.body.update_by, update_at: req.body.update_at
        }, {
            where: { id: req.body.caja_id }
        })
        //Información actualizada
        res.json(InfoTotal)
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

