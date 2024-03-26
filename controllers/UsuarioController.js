//Importar el Modelo de Area
import CajaModel from "../models/CajaModel.js";
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import DatosPersoUsuarioModel from "../models/DatosPersoUsuarioModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
//Modificar la respuesta para que esté como en AreaCajaController
export const getAllUsuarios = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const usuarios = await UsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre_usuario", "contraseña"]
        }, { transaction: transaction });

        const datosUsuarios = await Promise.all(usuarios.map(async function (usuario) {
            //Información de la tabla Datos_Personales_Usuario
            const datopersonal = await DatosPersoUsuarioModel.findOne({
                where: {
                    estatus: true,
                    fk_idusuario: usuario.id
                },
                attributes: ["nombres", "primer_apellido", "segundo_apellido", "telefono"]
            }, { transaction: transaction })
            return {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario,
                contraseña: usuario.contraseña,
                nombres: datopersonal.nombres,
                primer_apellido: datopersonal.primer_apellido,
                segundo_apellido: datopersonal.segundo_apellido,
                telefono: datopersonal.telefono
            }
        }))

        await transaction.commit();
        //Modificar aquí y los datos obtenerlos de arriba
        res.json(
            datosUsuarios
        )
    } catch (error) {
        res.json({ message: error.message })
        await transaction.rollback();
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
    const transaction = await db.transaction();
    try {
        const Usuario = await UsuarioModel.create({
            nombre_usuario: req.body.nombre_usuario,
            contraseña: req.body.contraseña,
            estatus: req.body.estatus,
            create_by: req.body.create_by,
            create_at: req.body.create_at
        }, { transaction: transaction });

        const Fk_idusuario = Usuario.id

        await DatosPersoUsuarioModel.create({
            nombres: req.body.nombre_personal,
            primer_apellido: req.body.primer_apellido,
            segundo_apellido: req.body.segundo_apellido,
            telefono: req.body.telefono,
            estatus: req.body.estatus,
            fk_idusuario: Fk_idusuario
        }, { transaction: transaction });


        await transaction.commit();
        res.json({
            "message": "Registros creados correctamete"
        })
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}

//Actualizar o modificar un registro
export const updateUsuario = async (req, res) => {
    //Se modifica el estatus a false en la tabla de Usuarios y en la de PermisoUsuarios
    try {
        await UsuarioModel.update(req.body, {
            where: { id: req.params.id }
        })
        await PermisoUsuarioModel.update(req.body, {
            where: { usuarios_id: req.params.id }
        })
        await DatosPersoUsuarioModel.update(req.body, {
            where: { fk_idusuario: req.params.id }
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