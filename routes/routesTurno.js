import express from 'express';
import {
    createTurno, getAllTurnosPendientes, getTurno, updateTurno,
    getTurnoAtendiendo, getTurnoSiguiente
} from '../controllers/TurnoController.js';

const turnoRoutes = express.Router();

//Rutas para el CRUD de Turno
turnoRoutes.get('/', getAllTurnosPendientes);
turnoRoutes.get('/siguiente', getTurnoSiguiente);
turnoRoutes.get('/:id', getTurno);
turnoRoutes.get('/:id/:usuario', getTurnoAtendiendo);
turnoRoutes.post('/', createTurno);
turnoRoutes.put('/:id', updateTurno);


export default turnoRoutes;