import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AreaModel from "./AreaModel.js";

const UsuarioModel = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: { type: DataTypes.STRING },
    contraseña: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
    fk_idarea: {
        type: DataTypes.INTEGER,
        references: {
            model: AreaModel,
            key: AreaModel.id
        }
    }
});

export default UsuarioModel;