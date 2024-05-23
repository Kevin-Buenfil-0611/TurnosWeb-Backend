import db from "../database/db.js";
import { DataTypes } from "sequelize";
import TurnoModel from "./TurnoModel.js";

const FolioModel = db.define('folios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_folio: { type: DataTypes.INTEGER },
    estatus: { type: DataTypes.STRING },
    create_by: { type: DataTypes.STRING },
    create_at: { type: DataTypes.DATE },
    update_by: { type: DataTypes.STRING },
    update_at: { type: DataTypes.DATE },
    fk_idturno: {
        type: DataTypes.INTEGER,
        references: {
            model: TurnoModel,
            key: TurnoModel.id
        }
    }
});

export default FolioModel;