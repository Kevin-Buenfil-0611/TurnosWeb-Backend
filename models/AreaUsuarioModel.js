//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AreaModel from "./AreaModel.js";
import UsuarioModel from "./UsuarioModel.js";

const AreaUsuarioModel = db.define('area_usuarios', {
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
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: UsuarioModel,
            key: UsuarioModel.id
        }
    },
    estatus: { type: DataTypes.BOOLEAN }
});


export default AreaUsuarioModel;
