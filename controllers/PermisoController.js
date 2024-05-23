//Importar el Modelo de Permiso
import PermisoModel from "../models/PermisoModel.js";
import db from "../database/db.js";
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";

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
    const transaction = await db.transaction();
    try {
        await PermisoModel.create(req.body,
            { transaction: transaction })

        await transaction.commit();
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updatePermiso = async (req, res) => {
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Primero se cambia el estatus a false  del registro de permiso
        await PermisoModel.update({
            estatus: req.body.estatus,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
        }, { transaction: transaction })

        //Se buscan todos los registros que coincidan con el permiso"eliminada"
        const UsuarioConPermiso = await PermisoUsuarioModel.findAll({
            where: { permisos_id: req.params.id },
            attributes: ["id"]
        })

        //Si se encuentra un registro se cambia su estatus a false
        if (UsuarioConPermiso != null) {
            await Promise.all(UsuarioConPermiso.map(async function (registro) {
                await PermisoUsuarioModel.update({ estatus: req.body.estatus }, {
                    where: { id: registro.id }
                })
                return registro.id
            }))
        }
        await transaction.commit();
        res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        await transaction.rollback();
        res.json({ message: error.message })
    }
}

export const updateNombrePermiso = async (req, res) => {
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        await PermisoModel.update({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            update_by: req.body.update_by,
            update_at: formatoFechaUpdate
        }, {
            where: { id: req.params.id }
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