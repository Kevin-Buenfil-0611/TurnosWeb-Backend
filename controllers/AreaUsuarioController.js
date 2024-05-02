//Importar el Modelo de Area
import AreaUsuarioModel from "../models/AreaUsuarioModel.js";
import AreaModel from "../models/AreaModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllAreaUsuario = async (req, res) => {
    try {
        //Obtener toda la info de la tabla AreaCaja
        const areasUsuarios = await AreaUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "area_id", "usuario_id"]
        });

        //Ciclo para modificar cada registro de la tabla areasCajas
        const InfoTotal = await Promise.all(areasUsuarios.map(async function (registro) {

            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.area_id
                },
                attributes: ["nombre_area"]
            })
            //Información de la tabla Cajas
            const usuarioNombre = await UsuarioModel.findOne({
                where: {
                    estatus: true,
                    id: registro.usuario_id
                },
                attributes: ["nombre_usuario"]
            })

            //Construir el nuevo objeto con las propiedades que necesito
            return {
                id: registro.id,
                area_id: registro.area_id,
                nombre_area: areaNombre.nombre_area,
                usuario_id: registro.usuario_id,
                nombre_usuario: usuarioNombre.nombre_caja
            }
        }))
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar todas las areas de un usuario en la tabla AreaCajas
export const getAreaUsuario = async (req, res) => {
    try {
        //Información de la tabla AreaCajas
        const areaUsuario = await AreaUsuarioModel.findAll({
            where: { usuario_id: req.params.usuario_id, estatus: true },
        })
        const InfoTotal = await Promise.all(areaUsuario.map(async function (registro) {
            const IDArea = registro.area_id
            return IDArea
        }))
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createAreaUsuario = async (req, res) => {
    try {
        await AreaUsuarioModel.create(req.body)
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Actualizar o modificar un registro
export const updateAreaUsuario = async (req, res) => {
    const transaction = await db.transaction();
    let fechaUpdate = new Date();
    const formatoFechaUpdate = fechaUpdate.toISOString();
    try {
        //Aqui se elimine primero y luego se insertan los nuevos elementos
        //Eliminar los registros de la caja en la tabla AreaCajas
        await AreaUsuarioModel.destroy({
            where: {
                usuario_id: req.body.usuario_id
            }
        }, {
            transaction: transaction
        });

        await UsuarioModel.update({ nombre_usuario: req.body.nombre_usuario },
            {
                where: { id: req.body.usuario_id },
                transaction: transaction
            })
        const ListaAreasId = req.body.areasMod

        await Promise.all(ListaAreasId.map(async function (areaID) {
            await AreaUsuarioModel.create(
                {
                    area_id: areaID,
                    usuario_id: req.body.usuario_id,
                    estatus: true
                }, { transaction: transaction }
            )
        }))
        await transaction.commit();

        //Actualizo la información una vez creado los nuevos campos y devuelvo un json con la informacion nueva
        const areasUsuarios = await AreaUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "area_id", "usuario_id"]
        });

        //Ciclo para mostrar registro de la tabla areasCajas
        const InfoTotal = await Promise.all(areasUsuarios.map(async function (registro) {
            //Información de la tabla Areas
            const areaNombre = await AreaModel.findOne({
                where: {
                    estatus: true,
                    id: registro.area_id
                },
                attributes: ["nombre_area"]
            })
            //Información de la tabla Cajas
            const usuarioNombre = await UsuarioModel.findOne({
                where: {
                    estatus: true,
                    id: registro.usuario_id
                },
                attributes: ["nombre_usuario"]
            })
            return {
                id: registro.id,
                area_id: registro.area_id,
                nombre_area: areaNombre.nombre_area,
                usuario_id: registro.usuario_id,
                nombre_usuario: usuarioNombre.nombre_usuario
            }
        }))

        await UsuarioModel.update({
            update_by: req.body.update_by, update_at: formatoFechaUpdate
        }, {
            where: { id: req.body.usuario_id }
        })

        //Información actualizada
        res.json(InfoTotal)
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}

export const hideAreaUsuario = async (req, res) => {
    try {
        await AreaUsuarioModel.update(req.body, {
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
export const deleteAreaUsuario = async (req, res) => {
    try {
        await AreaUsuarioModel.put({
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
