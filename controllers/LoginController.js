import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsuarioModel from "../models/UsuarioModel.js";
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import PermisoModel from "../models/PermisoModel.js";
import db from "../database/db.js";

dotenv.config();

//********** Ruta find user ********************

//Validar que el usuario exista, validar que la contraseña sea correcta
//Devuelve un json con el nombre del usuario, sus permisos, si tiene autorización y un mensaje de autorizado
export const findUser = async (req, res) => {
    const transaction = await db.transaction();
    const { usuario, contraseña } = req.body
    try {
        const usuarioDB = await UsuarioModel.findOne({
            where: {
                nombre_usuario: usuario
            }
        }, { transaction: transaction })

        // Crea un hash SHA256 de la contraseña proporcionada la librería tiene su método para comparar
        // 2 contraseñas ecnriptadas
        const contraLogin = contraseña;
        const contraBD = usuarioDB.contraseña;

        const credencialesIncorrectas = usuarioDB == null ? false
            : (contraLogin === contraBD)
        if (!(usuarioDB && credencialesIncorrectas)) {
            res.status(401).json({
                error: 'Usuario o contraseña incorrecta'
            })
        }

        const permisos = await PermisoUsuarioModel.findAll({
            where: {
                usuarios_id: usuarioDB.id
            },
            attributes: ["id", "permisos_id", "usuarios_id", "estatus"]
        }, { transaction: transaction })

        const ListaPermisos = await Promise.all(permisos.map(async function (permiso) {
            const nombrepermiso = await PermisoModel.findOne({
                where: {
                    estatus: true,
                    id: permiso.permisos_id
                }, attributes: ["nombre"]
            }, { transaction: transaction })
            return { permisos: nombrepermiso.nombre }
        }))

        const NombrePermisos = ListaPermisos.map((permiso) => (
            permiso.permisos
        ))

        const infoDelUsuario = {
            usuario: usuarioDB.id
        }
        const token = jwt.sign(infoDelUsuario, process.env.SECRET, { expiresIn: '1h' });
        await transaction.commit();
        res.json({
            autorizado: true,
            usuario_id: usuarioDB.id,
            usuario: usuarioDB.nombre_usuario,
            permisos: NombrePermisos,
            token: token
        })
    } catch (error) {
        //Ya no devuelvo un json en el error porque generaba conflicto al devolver la respuesta con los if
        await transaction.rollback();
        res.json({
            message: "Credenciales Incorrectas",
            autorizado: false
        });

    }
}

export const validarCampos = async (req, res, next) => {
    //Realizar comprobaciones para validar usuario y contraseña
    next();
}
//********** Ruta comprobar token ********************
export const validarToken = async (req, res, next) => {
    const accessToken = req.headers['token'];
    if (!accessToken) res.json({
        message: 'El usuario no está autorizado',
        autorizado: false
    });
    jwt.verify(accessToken, process.env.SECRET, (err, user) => {
        if (err) {
            res.json({
                message: 'Acceso denegado, token expirado o incorrecto',
                autorizado: false
            })
        } else {
            next();
        }
    })
}

export const renovarToken = async (req, res) => {
    const userID = { usuario_id: req.body.usuario_id }
    // Generar un nuevo token
    const newToken = jwt.sign(userID, process.env.SECRET, { expiresIn: '1h' });
    // Enviar el nuevo token al cliente
    res.json({
        token: newToken,
        autorizado: true
    });
}
