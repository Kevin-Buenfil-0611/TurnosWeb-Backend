import express from 'express';
import {
    createPermisoUsuario, deletePermisoUsuario, getAllPermisoUsuario,
    getPermisoUsuario, updatePermisoUsuario
} from '../controllers/PermisoUsuarioController.js';

const permisousuarioRoutes = express.Router();

//Rutas para el CRUD de PermisosUsuario
permisousuarioRoutes.get('/', getAllPermisoUsuario);
permisousuarioRoutes.get('/:id', getPermisoUsuario);
permisousuarioRoutes.post('/', createPermisoUsuario);
permisousuarioRoutes.put('/:id', updatePermisoUsuario);
permisousuarioRoutes.delete('/:id', deletePermisoUsuario);

export default permisousuarioRoutes;