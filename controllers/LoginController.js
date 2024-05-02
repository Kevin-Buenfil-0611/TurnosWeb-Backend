import UsuarioModel from "../models/UsuarioModel.js";
import PermisoUsuarioModel from "../models/PermisoUsuariosModel.js";
import PermisoModel from "../models/PermisoModel.js";
import db from "../database/db.js";


//Validar que el usuario exista, validar que la contraseña sea correcta
//Devuelve un json con el nombre del usuario, sus permisos, si tiene autorización y un mensaje de autorizado
export const findUser = async (req, res) => {
    const transaction = await db.transaction();
    try {
        //Busca el usuario en la base de datos
        // const usuario = await db.query(
        //     'SELECT * FROM usuarios WHERE nombre_usuario = :nombreUsuario',
        //     {
        //         replacements: { nombreUsuario: req.body.usuario },
        //         type: db.QueryTypes.SELECT,
        //         transaction: transaction
        //     }
        // );

        const usuario = await UsuarioModel.findOne({
            where: {
                nombre_usuario: req.body.usuario
            }
        }, { transaction: transaction })

        if (!usuario
        ) {
            res.json({
                message: "Usuario no encontrado",
                autorizado: false
            });
        }
        // Crea un hash SHA256 de la contraseña proporcionada la librería tiene su método para comparar
        // 2 contraseñas ecnriptadas

        const contraLogin = req.body.contraseña;
        const contraBD = usuario.contraseña;

        if (contraLogin !== contraBD) {
            return res.json({
                message: "Contraseña incorrecta",
                autorizado: false
            });
        } else {
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

            res.json({
                message: "Usuario y contraseña correcto",
                usuario: usuario.nombre_usuario,
                usuario_id: usuario.id,
                caja_id: usuario.fk_idcaja,
                permisos: NombrePermisos,
                autorizado: true
            })
        }
    } catch (error) {
        //Ya no devuelvo un json en el error porque generaba conflicto al devolver la respuesta con los if
        // res.json({
        //     message: "Credenciales Incorrectas",
        //     autorizado: false
        // });
        await transaction.rollback();
    }
}