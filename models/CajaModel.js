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
    create_by: { type: DataTypes.STRING },
    create_at: { type: DataTypes.DATE },
    update_by: { type: DataTypes.STRING },
    update_at: { type: DataTypes.DATE }
});



export default CajaModel;
