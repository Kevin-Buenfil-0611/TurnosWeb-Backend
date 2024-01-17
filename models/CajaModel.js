//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const CajaModel = db.define('cajas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_caja: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
});



export default CajaModel;
