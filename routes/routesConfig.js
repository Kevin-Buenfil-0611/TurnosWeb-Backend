import express from 'express';
import { getAllConfig, getConfig } from '../controllers/ConfigController.js';

const configRoutes = express.Router();

//Rutas para el CRUD de Configuración
configRoutes.get('/', getAllConfig);
configRoutes.post('/nombre', getConfig);


export default configRoutes;