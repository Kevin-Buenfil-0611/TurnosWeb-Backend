import express from 'express';
import { check } from 'express-validator';
import {
    findUser, validarToken, renovarToken,
    validarCampos
} from '../controllers/LoginController.js';

const loginRoutes = express.Router();

//Rutas para el CRUD de Login
loginRoutes.post('/findUser', [
    check('usuario', "Se requiere un usuario válido").not().isEmpty().isLength({ max: 30 }),
    check('contraseña', "Contraseña vacía").not().isEmpty(),
    validarCampos
], findUser);
loginRoutes.get('/comprobarToken', validarToken, renovarToken);


export default loginRoutes;