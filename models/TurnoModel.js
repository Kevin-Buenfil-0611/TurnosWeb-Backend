import db from "../database/db.js";
import { DataTypes } from "sequelize";
import AreaModel from "./AreaModel.js";
import CajaModel from "./CajaModel.js";

const TurnoModel = db.define('turnos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    create_by: { type: DataTypes.STRING },
    create_at: { type: DataTypes.DATE },
    turno_seleccionado: { type: DataTypes.DATE },
    turno_atendido: { type: DataTypes.DATE },
    update_by: { type: DataTypes.STRING },
    update_at: { type: DataTypes.DATE },

    estatus: { type: DataTypes.STRING },
    fk_idarea: {
        type: DataTypes.INTEGER,
        references: {
            model: AreaModel,
            key: AreaModel.id
        }
    },
    fk_idcaja: {
        type: DataTypes.INTEGER,
        references: {
            model: CajaModel,
            key: CajaModel.id
        }
    }

});

export default TurnoModel;