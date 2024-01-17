//Exportar librerías
import express from "express";
import cors from "cors";
import db from "./database/db.js";
//Exportar modelos de las tablas
import UsuarioModel from "./models/UsuarioModel.js";
import AreaModel from "./models/AreaModel.js";
import CajaModel from "./models/CajaModel.js";
import AreaCajaModel from "./models/AreaCajaModel.js";
//Exportar rutas de los modelos
import cajaRoutes from "./routes/routesCaja.js";
import areaRoutes from "./routes/routesArea.js"
import usuarioRoutes from "./routes/routesUsuario.js";
import areacajaRoutes from "./routes/routesAreaCaja.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/areas', areaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/cajas', cajaRoutes);
app.use('/areacaja', areacajaRoutes);

//Crear relaciones entre tablas
//Unión tabla Usuarios con tabla Areas
UsuarioModel.belongsTo(AreaModel, { foreignKey: "fk_idarea" });
AreaModel.hasMany(UsuarioModel, { foreignKey: "fk_idarea" });

//Unión tabla Caja con tabla Areas
CajaModel.belongsToMany(AreaModel, { through: AreaCajaModel, foreignKey: "caja_id", otherKey: "area_id", sourceKey: 'id', targetKey: 'id' });
AreaModel.belongsToMany(CajaModel, { through: AreaCajaModel, foreignKey: "area_id", otherKey: "caja_id", sourceKey: 'id', targetKey: 'id' });

try {
    db.authenticate();
    console.log("Conexión exitosa a la DB")
} catch (error) {
    console.log(`El error de conexión es: ${error}`)
}

app.listen(8000, () => {
    console.log("Server UP running in http://localhost:8000/")
});