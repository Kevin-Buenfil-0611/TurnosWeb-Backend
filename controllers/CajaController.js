//Importar el Modelo de Caja
import CajaModel from "../models/CajaModel.js";
import AreaCajaModel from "../models/AreaCajaModel.js";
import db from "../database/db.js";

//** Métodos para el CRUD **/

//Mostrar todos los registros
export const getAllCajas = async (req, res) => {
    try {
        const Cajas = await CajaModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre_caja"]
        });
        res.json(Cajas)
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getCaja = async (req, res) => {
    try {
        const Caja = await CajaModel.findOne({
            where: { estatus: true, id: req.params.id },
            attributes: ["id", "nombre_caja"]

        })
        res.json(Caja)
    } catch (error) {
        res.json({ message: error.message })
    }
}

//Crear un registro
export const createCaja = async (req, res) => {
    //Se implemetó las transacciones SQL para crear primero la caja 
    // y luego agregar su dato a la tabla AreaCajas
    const transaction = await db.transaction();
    try {
        //Primero se crea el registro en la tabla Cajas
        const Caja = await CajaModel.create(
            {
                nombre_caja: req.body.nombre_Caja,
                estatus: req.body.estatus
            }, { transaction: transaction })

        //Se guarda la lista de los ID Areas en una constante
        const ListaAreasId = req.body.areasID;
        //Se guarda el id de la caja en una constante
        const CajaId = Caja.id;

        // Se recorre la lista de areas y por cada id se crea un registro en la tabla AreaCajas
        await Promise.all(ListaAreasId.map(async function (areaID) {
            const nuevasAreaCajas = await AreaCajaModel.create(
                {
                    area_id: areaID,
                    caja_id: CajaId,
                    estatus: true
                }, { transaction: transaction }
            )
            return nuevasAreaCajas;
        })
        )
        //Se realiza el commit para verificar que se completen todas las consultas anteriores
        // y una vez completadas se guardan y ejecutan
        await transaction.commit();

        return res.json({
            "message": "Registro actualizado correctamete"
        })
    } catch (error) {
        //En caso de algún fallo se cancelan las consultas en caso de haberse ejecutado algunas
        //y no se guardan los datos
        res.json({ message: error.message })
        await transaction.rollback();
    }
}

//Actualizar o modificar un registro
export const updateCaja = async (req, res) => {
    try {
        await CajaModel.update(req.body, {
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
export const deleteCaja = async (req, res) => {
    try {
        await CajaModel.destroy({
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