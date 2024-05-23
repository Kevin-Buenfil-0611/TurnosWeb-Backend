//Importar el Modelo de Area
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import DatosPersoUsuarioModel from "../models/DatosPersoUsuarioModel.js";
import db from "../database/db.js";
import CajaUsuarioModel from "../models/CajaUsuarioModel.js";
import AreaUsuarioModel from "../models/AreaUsuarioModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
//Modificar la respuesta para que esté como en AreaCajaController
export const getAllUsuarios = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const usuarios = await UsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre_usuario"]
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
                nombres: datopersonal.nombres,
                primer_apellido: datopersonal.primer_apellido,
                segundo_apellido: datopersonal.segundo_apellido,
                telefono: datopersonal.telefono
            }
        }))

        await transaction.commit();
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
            create_by: req.body.create_by
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
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Primero se cambia el estatus a false  del registro del usuario
        await UsuarioModel.update({
            estatus: req.body.estatus,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
        }, { transaction: transaction })

        //Se buscan todos los registros que coincidan con el usuario "eliminado"
        const PermisosDelUsuario = await PermisoUsuarioModel.findAll({
            where: { usuarios_id: req.params.id },
            attributes: ["id"]
        }, { transaction: transaction })

        const DatosPersDelUsuario = await DatosPersoUsuarioModel.findAll({
            where: { fk_idusuario: req.params.id },
            attributes: ["id"]
        }, { transaction: transaction })

        const CajasDelUsuario = await CajaUsuarioModel.findAll({
            where: { usuarios_id: req.params.id },
            attributes: ["id"]
        }, { transaction: transaction })

        const AreasDelUsuario = await AreaUsuarioModel.findAll({
            where: { usuario_id: req.params.id },
            attributes: ["id"]
        }, { transaction: transaction })

        //Si se encuentra un registro se cambia su estatus a false
        if (PermisosDelUsuario != null) {
            await Promise.all(PermisosDelUsuario.map(async function (registro) {
                await PermisoUsuarioModel.update({ estatus: req.body.estatus }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (DatosPersDelUsuario != null) {
            await Promise.all(DatosPersDelUsuario.map(async function (registro) {
                await DatosPersoUsuarioModel.update({ estatus: req.body.estatus }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (CajasDelUsuario != null) {
            await Promise.all(CajasDelUsuario.map(async function (registro) {
                await CajaUsuarioModel.update({ estatus: req.body.estatus }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }

        if (AreasDelUsuario != null) {
            await Promise.all(AreasDelUsuario.map(async function (registro) {
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

//Mostrar un registro
export const updateContraseñaUsuario = async (req, res) => {
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        await UsuarioModel.update({
            contraseña: req.body.contraseña,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
        })
        res.json({
            contraseña: usuario.contraseña
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