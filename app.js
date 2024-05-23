//Exportar librerías
import express from "express";
import cors from "cors";
import db from "./database/db.js";
//Exportar modelos de las tablas
import AreaModel from "./models/AreaModel.js";
import CajaModel from "./models/CajaModel.js";
import TurnoModel from "./models/TurnoModel.js";
import AreaCajaModel from "./models/AreaCajaModel.js";
import AreaUsuarioModel from "./models/AreaUsuarioModel.js";
import UsuarioModel from "./models/UsuarioModel.js";
import PermisoModel from "./models/PermisoModel.js";
import PermisoUsuarioModel from "./models/PermisoUsuariosModel.js";
import DatosPersoUsuarioModel from "./models/DatosPersoUsuarioModel.js";
import CajaUsuarioModel from "./models/CajaUsuarioModel.js";
//Exportar rutas de los modelos
import cajaRoutes from "./routes/routesCaja.js";
import areaRoutes from "./routes/routesArea.js"
import usuarioRoutes from "./routes/routesUsuario.js";
import areacajaRoutes from "./routes/routesAreaCaja.js";
import areausuarioRoutes from "./routes/routesAreaUsuario.js";
import permisoRoutes from "./routes/routesPermiso.js";
import permisousuarioRoutes from "./routes/routesPermisoUsuario.js";
import datospersRoutes from "./routes/routesDatosPersUsuario.js";
import loginRoutes from "./routes/routesLogin.js";
import turnoRoutes from "./routes/routesTurno.js";
import cajausuarioRoutes from "./routes/routesCajaUsuario.js";
import configRoutes from "./routes/routesConfig.js";
//Controlador del video
import { subirVideo, eliminarVideo, obtenerListaVideos } from './controllers/VideoController.js';
import FolioModel from "./models/FolioModel.js";
//Ruta donde se encuentran los videos
const videosPath = 'C:/Users/Kevin/Desktop/Programa Turnos/turnos_backend/videos';
const app = express();

app.use(cors());
app.use(express.json());
app.use('/areas', areaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/cajas', cajaRoutes);
app.use('/areacaja', areacajaRoutes);
app.use('/permisos', permisoRoutes);
app.use('/permisousuario', permisousuarioRoutes);
app.use('/datospers', datospersRoutes);
app.use('/login', loginRoutes);
app.use('/turnos', turnoRoutes);
app.use('/cajausuario', cajausuarioRoutes);
app.use('/areausuario', areausuarioRoutes);
app.use('/config', configRoutes)

app.get('/obtenerlistavideos', obtenerListaVideos);
app.post('/subirvideos', subirVideo);
app.delete('/eliminarvideo', eliminarVideo);
app.use('/videos', express.static(videosPath));

//Crear relaciones entre tablas
//Unión tabla Usuarios con tabla Cajas
CajaModel.belongsToMany(UsuarioModel, { through: CajaUsuarioModel, foreignKey: "caja_id", otherKey: "usuario_id", sourceKey: 'id', targetKey: 'id' });
UsuarioModel.belongsToMany(CajaModel, { through: CajaUsuarioModel, foreignKey: "usuario_id", otherKey: "caja_id", sourceKey: 'id', targetKey: 'id' });

//Unión tabla Caja con tabla Areas
CajaModel.belongsToMany(AreaModel, { through: AreaCajaModel, foreignKey: "caja_id", otherKey: "area_id", sourceKey: 'id', targetKey: 'id' });
AreaModel.belongsToMany(CajaModel, { through: AreaCajaModel, foreignKey: "area_id", otherKey: "caja_id", sourceKey: 'id', targetKey: 'id' });

//Unión tabla Usuario con tabla Areas
UsuarioModel.belongsToMany(AreaModel, { through: AreaUsuarioModel, foreignKey: "usuario_id", otherKey: "area_id", sourceKey: 'id', targetKey: 'id' });
AreaModel.belongsToMany(UsuarioModel, { through: AreaUsuarioModel, foreignKey: "area_id", otherKey: "usuario_id", sourceKey: 'id', targetKey: 'id' });

//Unión tabla Caja con tabla Areas
PermisoModel.belongsToMany(UsuarioModel, { through: PermisoUsuarioModel, foreignKey: "permisos_id", otherKey: "usuario_id", sourceKey: 'id', targetKey: 'id' });
UsuarioModel.belongsToMany(PermisoModel, { through: PermisoUsuarioModel, foreignKey: "usuario_id", otherKey: "permisos_id", sourceKey: 'id', targetKey: 'id' });

//Union tabla usuario con tabla datos_personales_usuarios
UsuarioModel.hasOne(DatosPersoUsuarioModel, { foreignKey: 'fk_idusuario', sourceKey: 'id' });
DatosPersoUsuarioModel.belongsTo(UsuarioModel, { foreignKey: 'fk_idusuario', targetKey: 'id' });

//Union tabla areas con tabla turnos
AreaModel.hasOne(TurnoModel, { foreignKey: 'fk_idarea', sourceKey: 'id' });
TurnoModel.belongsTo(AreaModel, { foreignKey: 'fk_idarea', targetKey: 'id' });
//Union tabla caja con tabla turnos
CajaModel.hasOne(TurnoModel, { foreignKey: 'fk_idcaja', sourceKey: 'id' });
TurnoModel.belongsTo(CajaModel, { foreignKey: 'fk_idcaja', targetKey: 'id' });
//Union tabla folios con tabla turnos
TurnoModel.hasOne(FolioModel, { foreignKey: 'fk_idturno', sourceKey: 'id' });
FolioModel.belongsTo(TurnoModel, { foreignKey: 'fk_idturno', targetKey: 'id' });

try {
    db.authenticate();
    console.log("Conexión exitosa a la DB")
} catch (error) {
    console.log(`El error de conexión es: ${error}`)
}

app.listen(8000, () => {
    console.log("Server UP running in http://localhost:8000/")
});