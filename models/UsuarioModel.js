import db from "../database/db.js";
import { DataTypes } from "sequelize";

const UsuarioModel = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: { type: DataTypes.STRING },
    contraseña: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
    create_by: { type: DataTypes.STRING },
    create_at: { type: DataTypes.DATE },
    update_by: { type: DataTypes.STRING },
    update_at: { type: DataTypes.DATE }
});

export default UsuarioModel;