import ConfigModel from "../models/ConfigModel.js";

//Mostrar todos los registros
export const getAllConfig = async (req, res) => {
    try {
        const configuraciones = await ConfigModel.findAll({
            where: { estatus: true },
            attributes: ["id", "nombre", "descripcion"]
        });
        res.json(
            configuraciones
        )
    } catch (error) {
        res.json({ message: error.message })
    }
};

//Mostrar un registro
export const getConfig = async (req, res) => {
    try {
        const configuracion = await ConfigModel.findOne({
            where: { nombre: req.body.nombre },
            attributes: ["id", "nombre", "valor", "estatus"]
        })
        res.json(configuracion)
    } catch (error) {
        res.json({ message: error.message })
    }
}





