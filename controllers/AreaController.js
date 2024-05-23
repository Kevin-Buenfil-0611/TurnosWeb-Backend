//Importar el Modelo de Area
import AreaModel from "../models/AreaModel.js";
import CajaModel from "../models/CajaModel.js";
import AreaCajaModel from "../models/AreaCajaModel.js";
import AreaUsuarioModel from "../models/AreaUsuarioModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllAreas = async (req, res) => {
    try {
        const areas = await AreaModel.findAll({
            where: { estatus: true },
            include: {
                model: CajaModel,
                attributes: ["id", "nombre_caja"]
            }
        });
        res.json(areas)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getArea = async (req, res) => {
    try {
        const area = await AreaModel.findOne({
            where: { id: req.params.id },
            include: {
                model: CajaModel,
                attributes: ["id", "nombre_caja"]
            }
        })
        res.json(area)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createArea = async (req, res) => {
    try {
        await AreaModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}
export const updateNombreArea = async (req, res) => {
    try {
        const transaction = await db.transaction();
        let fechaUpdate = new Date();
        const formatoFechaUpdate = fechaUpdate.toISOString();

        await AreaModel.update({
            nombre_area: req.body.nombre_area,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.body.id }
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

//Actualizar o modificar un registro
export const updateArea = async (req, res) => {
    const transaction = await db.transaction();

    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Primero se cambia el estatus a false  del registro de area
        await AreaModel.update({
            estatus: req.body.estatus,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
        }, { transaction: transaction })

        //Se buscan todos los registros que coincidan con la area "eliminada"
        const CajaConArea = await AreaCajaModel.findAll({
            where: { area_id: req.params.id },
            attributes: ["id"]
        })
        const UsuarioConArea = await AreaUsuarioModel.findAll({
            where: { area_id: req.params.id },
            attributes: ["id"]
        })

        //Si se encuentra un registro se cambia su estatus a false
        if (CajaConArea != null) {
            await Promise.all(CajaConArea.map(async function (registro) {
                await AreaCajaModel.update({
                    estatus: req.body.estatus
                }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (UsuarioConArea != null) {
            await Promise.all(UsuarioConArea.map(async function (registro) {
                await AreaUsuarioModel.update({ estatus: req.body.estatus }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Obtener el nombre de las áreas de la caja del usuario
export const areaUsuario = async (req, res) => {
    try {
        const areasID = req.body.listaAreas
        const Info = await Promise.all(areasID.map(async function (areaID) {
            const NombreArea = await AreaModel.findOne({
                where: { id: areaID, estatus: true },
                attributes: ["nombre_area"]
            })
            return NombreArea.nombre_area
        }))
        res.json(Info)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Eliminar un registro
export const deleteArea = async (req, res) => {
    try {
        await AreaModel.destroy({
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