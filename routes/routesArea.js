import express from 'express';
import {
    createArea, deleteArea, getAllAreas, updateNombreArea,
    getArea, updateArea, areaUsuario
} from '../controllers/AreaController.js';

const areaRoutes = express.Router();

//Rutas para el CRUD de Area
areaRoutes.get('/', getAllAreas);
areaRoutes.get('/:id', getArea);
areaRoutes.post('/', createArea);
areaRoutes.post('/areaUsuario', areaUsuario);
areaRoutes.put('/updateNombre', updateNombreArea);
areaRoutes.put('/:id', updateArea);
areaRoutes.delete('/:id', deleteArea);

export default areaRoutes;