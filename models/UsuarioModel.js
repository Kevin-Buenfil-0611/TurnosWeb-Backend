import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre_usuario: { type: DataTypes.STRING },
    contraseña: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
    fk_idarea: {
        type: DataTypes.INTEGER,
    }
});

export default UsuarioModel;