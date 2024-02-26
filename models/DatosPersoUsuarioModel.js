import db from "../database/db.js";
import { DataTypes } from "sequelize";
import UsuarioModel from "./UsuarioModel.js";

const DatosPersoUsuarioModel = db.define('datos_personales_usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombres: { type: DataTypes.STRING },
    primer_apellido: { type: DataTypes.STRING },
    segundo_apellido: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    estatus: { type: DataTypes.BOOLEAN },
    fk_idusuario: {
        type: DataTypes.INTEGER,
        references: {
            model: UsuarioModel,
            key: UsuarioModel.id
        }
    },
    usuarios_fk_idarea: {
        type: DataTypes.INTEGER,
        references: {
            model: UsuarioModel,
            key: UsuarioModel.fk_idarea
        }
    }
});

export default DatosPersoUsuarioModel;