import express from "express";
import cors from "cors";
import db from "./database/db.js";
import areaRoutes from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/areas', areaRoutes);

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