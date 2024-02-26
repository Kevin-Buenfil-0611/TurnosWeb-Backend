import DatosPersoUsuarioModel from "../models/DatosPersoUsuarioModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllDatosPers = async (req, res) => {
    try {
        //
        const datospers = await DatosPersoUsuarioModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombres", "primer_apellido",
                "segundo_apellido", "telefono"]
        });

        res.json(
            datospers
        )
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getDatoPer = async (req, res) => {
    try {
        const datoperusuario = await DatosPersoUsuarioModel.findAll({
            where: { id: req.params.id },
            attributes: ["id", "nombres", "primer_apellido",
                "segundo_apellido", "telefono"]
        })
        res.json(datoperusuario)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createDatoPers = async (req, res) => {
    const transaction = await db.transaction();
    try {
        await DatosPersoUsuarioModel.create(req.body,
            { transaction: transaction })

        await transaction.commit();
        res.json({
            "message": "Registro creado correctamete"
        })
    } catch (error) {
        res.json({ message: error.message });
        await transaction.rollback();
    }
}

//Actualizar o modificar un registro
export const updateDatoPers = async (req, res) => {
    //Se modifica los datos que brinde la funcion
    try {
        await DatosPersoUsuarioModel.update(req.body, {
            where: { fk_idusuario: req.params.id }
        })
        //Consulto nuevamente los datos y los devuelvo 

        const NuevosDatosPersoUsuario = await DatosPersoUsuarioModel.findAll({
            where: estatus = true,
            attributes: ["id", "nombres", "primer_apellido",
                "segundo_apellido", "telefono"]
        })
        res.json({
            NuevosDatosPersoUsuario
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Eliminar un registro
export const deleteDatosPers = async (req, res) => {
    try {
        await DatosPersoUsuarioModel.destroy({
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