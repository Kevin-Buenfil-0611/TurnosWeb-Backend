import express from 'express';
import { createDatoPers, deleteDatosPers, getAllDatosPers, getDatoPer, updateDatoPers }
    from '../controllers/DatosPersUsuarioController.js';

const datospersRoutes = express.Router();

//Rutas para el CRUD de Area
datospersRoutes.get('/', getAllDatosPers);
datospersRoutes.get('/:id', getDatoPer);
datospersRoutes.post('/', createDatoPers);
datospersRoutes.put('/:id', updateDatoPers);
datospersRoutes.delete('/:id', deleteDatosPers);

export default datospersRoutes;