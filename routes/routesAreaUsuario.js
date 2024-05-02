import express from 'express';
import {
    createAreaUsuario, deleteAreaUsuario, getAllAreaUsuario,
    getAreaUsuario, updateAreaUsuario, hideAreaUsuario
} from '../controllers/AreaUsuarioController.js';

const areausuarioRoutes = express.Router();

//Rutas para el CRUD de Area
areausuarioRoutes.get('/', getAllAreaUsuario);
areausuarioRoutes.get('/:usuario_id', getAreaUsuario);
areausuarioRoutes.post('/', createAreaUsuario);
areausuarioRoutes.put('/:id/:usuario_id', hideAreaUsuario);
areausuarioRoutes.put('/:id', updateAreaUsuario);
areausuarioRoutes.delete('/:id', deleteAreaUsuario);

export default areausuarioRoutes;