//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const AreaModel = db.define('areas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre_area: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
});

export default AreaModel;
