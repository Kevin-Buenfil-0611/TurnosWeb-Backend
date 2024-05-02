import express from 'express';
import {
    createPermiso, deletePermiso, getAllPermisos,
    getPermiso, updatePermiso, updateNombrePermiso
} from '../controllers/PermisoController.js';

const permisoRoutes = express.Router();

//Rutas para el CRUD de Area
permisoRoutes.get('/', getAllPermisos);
permisoRoutes.get('/:id', getPermiso);
permisoRoutes.post('/', createPermiso);
permisoRoutes.put('/:id', updatePermiso);
permisoRoutes.put('/:id/updateNombre', updateNombrePermiso);
permisoRoutes.delete('/:id', deletePermiso);

export default permisoRoutes;