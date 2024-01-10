import express from "express";
import cors from "cors";
import db from "./database/db.js";
import areaRoutes from "./routes/routesArea.js"
import usuarioRoutes from "./routes/routesUsuario.js";
import UsuarioModel from "./models/UsuarioModel.js";
import AreaModel from "./models/AreaModel.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/areas', areaRoutes);
app.use('/usuarios', usuarioRoutes)

//Crear relaciones entre tablas
UsuarioModel.belongsTo(AreaModel, { foreignKey: "fk_idarea" });
AreaModel.hasMany(UsuarioModel, { foreignKey: "fk_idarea" });


try {
    db.authenticate();
    console.log("Conexión exitosa a la DB")
} catch (error) {
    console.log(`El error de conexión es: ${error}`)
}

/*Prueba de Conexión
app.get('/', (req, res) => {
    res.send("Hola Mundo")
}); */

app.listen(8000, () => {
    console.log("Server UP running in http://localhost:8000/")
});