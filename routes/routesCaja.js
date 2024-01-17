import express from 'express';
import { createCaja, deleteCaja, getAllCajas, getCaja, updateCaja } from '../controllers/CajaController.js';

const cajaRoutes = express.Router();

//Rutas para el CRUD de Caja
cajaRoutes.get('/', getAllCajas);
cajaRoutes.get('/:id', getCaja);
cajaRoutes.post('/', createCaja);
cajaRoutes.put('/:id', updateCaja);
cajaRoutes.delete('/:id', deleteCaja);

export default cajaRoutes;