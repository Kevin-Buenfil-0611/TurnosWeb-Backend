import express from 'express';
import {
    createCajaUsuario, deleteCajaUsuario, getAllCajaUsuario,
    getCajaUsuario, updateCajaUsuario
} from '../controllers/CajaUsuarioController.js';

const cajausuarioRoutes = express.Router();

//Rutas para el CRUD de Area
cajausuarioRoutes.get('/', getAllCajaUsuario);
cajausuarioRoutes.get('/:id', getCajaUsuario);
cajausuarioRoutes.post('/', createCajaUsuario);
cajausuarioRoutes.put('/:id', updateCajaUsuario);
cajausuarioRoutes.delete('/:id', deleteCajaUsuario);

export default cajausuarioRoutes;