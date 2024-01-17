//Importar el Modelo de Area
import AreaModel from "../models/AreaModel.js";
import UsuarioModel from "../models/UsuarioModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
//Modificar la respuesta para que esté como en AreaCajaController
export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.findAll({
            where: { estatus: true },
            include: {
                model: AreaModel,
                attributes: ["id", "nombre_area"]
            }
            , attributes: ["id", "nombre_usuario", "contraseña"]
        });
        //Modificar aquí y los datos obtenerlos de arriba
        res.json(
            usuarios
        )
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getUsuario = async (req, res) => {
    try {
        const usuario = await UsuarioModel.findAll({
            where: { id: req.params.id }
        })
        res.json(usuario[0])
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createUsuario = async (req, res) => {
    try {
        await UsuarioModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updateUsuario = async (req, res) => {
    try {
        await UsuarioModel.update(req.body, {
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
export const deleteUsuario = async (req, res) => {
    try {
        await UsuarioModel.destroy({
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