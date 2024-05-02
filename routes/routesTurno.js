import express from 'express';
import {
    createTurno, getAllTurnosPendientes, getTurno, updateTurnoAtendiendo,
    getTurnoAtendiendo, getTurnoSiguiente, updateTurnoFinalizado
} from '../controllers/TurnoController.js';

const turnoRoutes = express.Router();

//Rutas para el CRUD de Turno
turnoRoutes.get('/', getAllTurnosPendientes);
turnoRoutes.get('/siguiente', getTurnoSiguiente);
turnoRoutes.get('/turnos/:usuario', getTurnoAtendiendo);
turnoRoutes.post('/', createTurno);
turnoRoutes.post('/turnos', getTurno);
turnoRoutes.put('/:id/turnoAtendiendo', updateTurnoAtendiendo);
turnoRoutes.put('/:id/turnoFinalizado', updateTurnoFinalizado);


export default turnoRoutes;