//Importar el Modelo de Permiso
import PermisoModel from "../models/PermisoModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllPermisos = async (req, res) => {
    try {
        const permisos = await PermisoModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre", "descripcion"]
        });
        res.json(
            permisos
        )
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getPermiso = async (req, res) => {
    try {
        const permiso = await PermisoModel.findAll({
            where: { id: req.params.id }
        })
        res.json(permiso[0])
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createPermiso = async (req, res) => {
    try {
        await PermisoModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updatePermiso = async (req, res) => {
    try {
        await PermisoModel.update(req.body, {
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
export const deletePermiso = async (req, res) => {
    try {
        await PermisoModel.destroy({
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