//Importar el Modelo de Area
import AreaCajaModel from "../models/AreaCajaModel.js";
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js";

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

//Mostrar un registro
export const getAreaCaja = async (req, res) => {
    try {
        //Información de la tabla AreaCajas
        const areaCaja = await AreaCajaModel.findOne({
            where: { id: req.params.id },
            attributes: ["id", "area_id", "caja_id"]
        })
        //Información de la tabla Areas
        const areaNombre = await AreaModel.findOne({
            where: {
                estatus: true,
                id: areaCaja.area_id
            },
            attributes: ["nombre_area"]
        })
        //Información de la tabla Cajas
        const cajaNombre = await CajaModel.findOne({
            where: {
                estatus: true,
                id: areaCaja.caja_id
            },
            attributes: ["nombre_caja"]
        })
        //Devolver la información de las 3 tablas
        res.json({
            id: areaCaja.id,
            area_id: areaCaja.area_id,
            caja_id: areaCaja.caja_id,
            nombre_area: areaNombre.nombre_area,
            nombre_caja: cajaNombre.nombre_caja
        })

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
        await AreaCajaModel.destroy({
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

