//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";
import CajaModel from "./CajaModel.js";
import UsuarioModel from "./UsuarioModel.js";

const CajaUsuarioModel = db.define('cajas_usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cajas_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: CajaModel,
            key: CajaModel.id
        }
    },
    usuarios_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: UsuarioModel,
            key: UsuarioModel.id
        }
    },
    estatus: { type: DataTypes.BOOLEAN }
});

export default CajaUsuarioModel;
