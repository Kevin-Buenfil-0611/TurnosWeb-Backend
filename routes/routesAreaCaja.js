import express from 'express';
import {
    createAreaCaja, deleteAreaCaja, getAllAreaCaja,
    getAreaCaja, updateAreaCaja, hideAreaCaja
} from '../controllers/AreaCajaController.js';

const areacajaRoutes = express.Router();

//Rutas para el CRUD de AreaCaja
areacajaRoutes.get('/', getAllAreaCaja);
areacajaRoutes.get('/:caja_id', getAreaCaja);
areacajaRoutes.post('/', createAreaCaja);
areacajaRoutes.put('/:id', hideAreaCaja);
areacajaRoutes.put('/mod/:caja_id', updateAreaCaja);
areacajaRoutes.delete('/:id', deleteAreaCaja);

export default areacajaRoutes;