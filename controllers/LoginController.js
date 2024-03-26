import UsuarioModel from "../models/UsuarioModel.js";
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import PermisoModel from "../models/PermisoModel.js";
import crypto from "crypto";
import db from "../database/db.js";


//Validar que el usuario exista, validar que la contraseña sea correcta
//Devuelve un json con el nombre del usuario, sus permisos, si tiene autorización y un mensaje de autorizado
export const findUser = async (req, res) => {
    const transaction = await db.transaction();
    try {
        //Busca el usuario en la base de datos
        const usuario = await UsuarioModel.findOne({
            where: {
                nombre_usuario: req.body.usuario
            }
        }, { transaction: transaction })

        if (!usuario) {
            //return res.status(400).send('Usuario no encontrado');
            res.json({
                message: "Usuario no encontrado",
                autorizado: false
            });
        }
        //Desencriptar la contraseña que manda el front y la que se recibe de la bd
        // Crea un hash SHA256 de la contraseña proporcionada la librería tiene su método para comparar
        // 2 contraseñas ecnriptadas
        // const hash = crypto.createHash('sha256');
        // hash.update(req.body.contraseña);
        // const hashedPassword = hash.digest('hex');

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        if (req.body.contraseña !== usuario.contraseña) {
            //return res.status(400).send('Contraseña incorrecta');
            return res.json({
                message: "Contraseña incorrecta",
                autorizado: false
            });
        }

        const permisos = await PermisoUsuarioModel.findAll({
            where: {
                usuarios_id: usuario.id
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

        await transaction.commit();

        // Checar la encriptacion de la contraseña
        // * Checar como guardar estos datos en la memoria local del navegador
        res.json({
            message: "Usuario y contraseña Correcto",
            usuario: usuario.nombre_usuario,
            usuario_id: usuario.id,
            caja_id: usuario.fk_idcaja,
            permisos: NombrePermisos,
            autorizado: true
        })
    } catch (error) {
        //Ya no devuelvo un json en el error porque generaba conflicto al devolver la respuesta con los if
        // res.json({
        //     message: "Usuario y contraseña Incorrecto",
        //     autorizado: false
        // });
        await transaction.rollback();
    }
}