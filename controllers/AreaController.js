//Importar el Modelo de Area
import AreaModel from "../models/AreaModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllAreas = async (req, res) => {
    try {
        const areas = await AreaModel.findAll();
        res.json(areas)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getArea = async (req, res) => {
    try {
        const area = await AreaModel.findAll({
            where: { id: req.params.id }
        })
        res.json(area[0])
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

//Actualizar o modificar un registro
export const updateArea = async (req, res) => {
    try {
        await AreaModel.update(req.body, {
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