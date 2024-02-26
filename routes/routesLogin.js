import express from 'express';
import { findUser } from '../controllers/LoginController.js';

const loginRoutes = express.Router();

//Rutas para el CRUD de Area
loginRoutes.post('/', findUser);


export default loginRoutes;