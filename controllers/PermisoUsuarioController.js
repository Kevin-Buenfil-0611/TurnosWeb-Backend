//Importar el Modelo de Area
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import PermisoModel from "../models/PermisoModel.js";
import db from "../database/db.js";
import moment from "moment";
//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllPermisoUsuario = async (req, res) => {
    try {
        //Obtener toda la info de la tabla PermisoUsuario
        const permisoUsuarios = await PermisoUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "permisos_id", "usuarios_id"]
        });
        //Ciclo para modificar cada registro de la tabla permisoUsuarios
        const InfoTotal = await Promise.all(permisoUsuarios.map(async function (registro) {

            //Información de la tabla Permisos
            const permisoNombre = await PermisoModel.findOne({
                where: {
                    estatus: true,
                    id: registro.permisos_id
                },
                attributes: ["nombre"]
            })
            //Información de la tabla Usuarios
            const usuarioNombre = await UsuarioModel.findOne({
                where: {
                    estatus: true,
                    id: registro.usuarios_id
                },
                attributes: ["nombre_usuario"]
            })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: registro.id,
                permiso_id: registro.permisos_id,
                nombre_permiso: permisoNombre,
                usuario_id: registro.usuarios_id,
                nombre_usuario: usuarioNombre.nombre_usuario
            }
        }))
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar todas las cajas en la tabla PermisoUsuarios
export const getPermisoUsuario = async (req, res) => {
    try {
        //Información de la tabla PermisoUsuarios
        const permisoUsuario = await PermisoUsuarioModel.findAll({
            where: { usuarios_id: req.params.id },
            attributes: ["usuarios_id", "permisos_id"]
        })
        res.json(permisoUsuario)

    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createPermisoUsuario = async (req, res) => {
    try {
        await PermisoUsuarioModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updatePermisoUsuario = async (req, res) => {
    const transaction = await db.transaction();
    try {

        await PermisoUsuarioModel.destroy({
            where: {
                usuarios_id: req.body.usuarios_id
            }
        }, { transaction: transaction }
        );

        const ListaPermisosId = req.body.permisosMod
        await Promise.all(ListaPermisosId.map(async function (permisoID) {
            await PermisoUsuarioModel.create(
                {
                    permisos_id: permisoID,
                    usuarios_id: req.body.usuarios_id,
                    estatus: true
                }
            )
        }))

        //Actualizo la información una vez creado los nuevos campos y devuelvo un json con la informacion nueva
        const permisoUsuarios = await PermisoUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "permisos_id", "usuarios_id"],
        }, { transaction: transaction });


        //Ciclo para modificar cada registro de la tabla permisoUsuarios
        const InfoTotal = await Promise.all(permisoUsuarios.map(async function (registro) {
            //Información de la tabla Permisos
            const permisoNombre = await PermisoModel.findOne({
                where: {
                    estatus: true,
                    id: registro.permisos_id
                },
                attributes: ["nombre"]
            })
            console.log("El nombre del permiso:" + permisoNombre.nombre)
            //Información de la tabla Usuarios
            const usuarioNombre = await UsuarioModel.findOne({
                where: {
                    estatus: true,
                    id: registro.usuarios_id
                },
                attributes: ["nombre_usuario"]
            })
            return {
                id: registro.id,
                permiso_id: registro.permisos_id,
                nombre_permiso: permisoNombre.nombre,
                usuario_id: registro.usuarios_id,
                nombre_usuario: usuarioNombre.nombre_usuario
            }
        }))

        //Actualiza la información de quien modificó al usuario
        await UsuarioModel.update({
            update_by: req.body.update_by, update_at: new Date().toISOString()
        }, {
            where: { id: req.params.id }
        })

        // await db.query(
        //     'update usuarios SET update_by = :update_by ,update_at = :update_at where id = :id',
        //     {
        //         replacements: {
        //             update_by: req.body.update_by,
        //             update_at: req.body.update_at, id: req.params.id
        //         },
        //         type: db.QueryTypes.SELECT,
        //         transaction: transaction
        //     }
        // );


        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}


//Eliminar un registro
export const deletePermisoUsuario = async (req, res) => {
    try {
        await PermisoUsuarioModel.destroy({
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

