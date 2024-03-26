import UsuarioModel from "../models/UsuarioModel.js";
import CajaModel from "../models/CajaModel.js";
import db from "../database/db.js";
import CajaUsuarioModel from "../models/CajaUsuarioModel.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllCajaUsuario = async (req, res) => {
    const transaction = await db.transaction();
    try {
        //Obtener toda la info de la tabla CajaUsuario
        const cajaUsuarios = await CajaUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "usuarios_id", "cajas_id"]
        }, { transaction: transaction });

        //Ciclo para modificar cada registro de la tabla cajaUsuarios
        const InfoTotal = await Promise.all(cajaUsuarios.map(async function (registro) {
            //Información de la tabla Permisos
            const cajaNombre = await CajaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.cajas_id
                },
                attributes: ["nombre_caja"]
            }, { transaction: transaction })
            //Información de la tabla Usuarios
            const usuarioNombre = await UsuarioModel.findOne({
                where: {
                    estatus: true,
                    id: registro.usuarios_id
                },
                attributes: ["nombre_usuario"]
            }, { transaction: transaction })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: registro.id,
                caja_id: registro.cajas_id,
                nombre_caja: cajaNombre.nombre_caja,
                usuario_id: registro.usuarios_id,
                nombre_usuario: usuarioNombre.nombre_usuario
            }
        }))
        await transaction.commit();
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
        await transaction.rollback();
    }
};

//Mostrar todas las cajas por usuario en la tabla CajaUsuarios
export const getCajaUsuario = async (req, res) => {
    try {
        //Información de la tabla PermisoUsuarios
        const cajaUsuario = await CajaUsuarioModel.findAll({
            where: { usuarios_id: req.params.id },
            attributes: ["usuarios_id", "cajas_id"]
        })
        res.json(cajaUsuario)

    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createCajaUsuario = async (req, res) => {
    try {
        await CajaUsuarioModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updateCajaUsuario = async (req, res) => {
    const transaction = await db.transaction();
    try {
        await CajaUsuarioModel.destroy({
            where: {
                usuarios_id: req.body.usuarios_id
            }
        }, { transaction: transaction }
        );

        const ListaCajasId = req.body.cajasMod
        await Promise.all(ListaCajasId.map(async function (cajaID) {
            await CajaUsuarioModel.create(
                {
                    caja_id: cajaID,
                    usuario_id: req.body.usuarios_id,
                    estatus: true
                }, { transaction: transaction }
            )
        }))

        await transaction.commit();
        //Actualizo la información una vez creado los nuevos campos y devuelvo un json con la informacion nueva
        const cajaUsuarios = await CajaUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "cajas_id", "usuarios_id"]
        });
        //Ciclo para modificar cada registro de la tabla permisoUsuarios
        const InfoTotal = await Promise.all(cajaUsuarios.map(async function (registro) {
            //Información de la tabla Permisos
            const cajaNombre = await CajaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.cajas_id
                },
                attributes: ["nombre_caja"]
            })
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
                caja_id: registro.cajas_id,
                nombre_permiso: cajaNombre.nombre,
                usuario_id: registro.usuarios_id,
                nombre_usuario: usuarioNombre.nombre_usuario
            }

        }))

        await UsuarioModel.update({
            update_by: req.body.update_by, update_at: req.body.update_at
        }, {
            where: { id: req.params.id }
        })
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}

//Eliminar un registro
export const deleteCajaUsuario = async (req, res) => {
    try {
        await CajaUsuarioModel.destroy({
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