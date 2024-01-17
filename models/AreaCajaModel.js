//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AreaModel from "./AreaModel.js";
import CajaModel from "./CajaModel.js";

const AreaCajaModel = db.define('area_cajas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    area_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: AreaModel,
            key: AreaModel.id
        }
    },
    caja_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: CajaModel,
            key: CajaModel.id
        }
    },
    estatus: { type: DataTypes.BOOLEAN }
});


export default AreaCajaModel;
