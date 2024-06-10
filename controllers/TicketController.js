import { spawn } from 'child_process';
import UsuarioModel from '../models/UsuarioModel.js';


//MFunción que ejecuta el srccipt de python para imprimir el ticket
export const imprimirTurno = async (req, res) => {
    try {
        const textoNumTurno = req.body.turno;
        const textoArea = req.body.area;
        const UsuarioID = req.body.usuario

        // const rutaDelUsuario = UsuarioModel.findOne({
        //     where: {
        //         id: UsuarioID
        //     },
        //     attributes: ["nombre_area"]
        //})
        const pythonScriptPath = "../turnos_backend/Script Python/Imprimir_ticket.py"
        const pythonProcess = spawn('python', [pythonScriptPath, textoNumTurno, textoArea]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Salida del script de Python: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error del script de Python: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`El script de Python se ha cerrado con el código ${code}`);
            res.send('Impresión completa');
        });

    } catch (error) {
        res.json({ message: error.message })

    }
}