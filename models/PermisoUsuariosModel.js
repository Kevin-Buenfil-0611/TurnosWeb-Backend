//Importamos la conexión a la DB e importamos sequelize
import db from "../database/db.js";
import { DataTypes } from "sequelize";
import PermisoModel from "./PermisoModel.js";
import UsuarioModel from "./UsuarioModel.js";

const PermisoUsuarioModel = db.define('permisos_usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    permisos_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: PermisoModel,
            key: PermisoModel.id
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


export default PermisoUsuarioModel;
