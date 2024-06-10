import express from 'express';
import { imprimirTurno } from '../controllers/TicketController.js';

const ticketRoutes = express.Router();

//Rutas para el CRUD de Turno
ticketRoutes.post('/imprimir', imprimirTurno);



export default ticketRoutes;