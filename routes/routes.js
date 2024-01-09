import express from 'express';
import { createArea, deleteArea, getAllAreas, getArea, updateArea } from '../controllers/AreaController.js';

const router = express.Router()

//Rutas para el CRUD de Area
router.get('/', getAllAreas);
router.get('/:id', getArea);
router.post('/', createArea);
router.put('/:id', updateArea);
router.delete('/:id', deleteArea);

export default router