import express from 'express';
import { createAreaCaja, deleteAreaCaja, getAllAreaCaja, getAreaCaja, updateAreaCaja } from '../controllers/AreaCajaController.js';

const areacajaRoutes = express.Router();

//Rutas para el CRUD de Area
areacajaRoutes.get('/', getAllAreaCaja);
areacajaRoutes.get('/:id', getAreaCaja);
areacajaRoutes.post('/', createAreaCaja);
areacajaRoutes.put('/:id', updateAreaCaja);
areacajaRoutes.delete('/:id', deleteAreaCaja);

export default areacajaRoutes;