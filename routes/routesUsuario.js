import express from 'express';
import { createUsuario, deleteUsuario, getAllUsuarios, getUsuario, updateUsuario }
    from '../controllers/UsuarioController.js';

const usuarioRoutes = express.Router()

//Rutas para el CRUD de Area
usuarioRoutes.get('/', getAllUsuarios);
usuarioRoutes.get('/:id', getUsuario);
usuarioRoutes.post('/', createUsuario);
usuarioRoutes.put('/:id', updateUsuario);
usuarioRoutes.delete('/:id', deleteUsuario);

export default usuarioRoutes