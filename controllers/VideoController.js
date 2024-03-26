import multer from 'multer';
import fs from 'fs';
import path from 'path';

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/Kevin/Desktop/Programa Turnos/turnos_backend/videos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const videoUpload = multer({ storage: videoStorage });

export const subirVideo = async (req, res) => {
    try {
        videoUpload.array('videos')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error al subir el video:', err);
                return res.status(500).send('Error al subir el video');
            } else if (err) {
                console.error('Error al subir el video:', err);
                return res.status(500).send('Error al subir el video');
            }
            res.send('Video(s) subido(s) correctamente');
        });
    } catch (error) {
        console.error('Error al subir el video:', error);
        res.status(500).send('Error al subir el video');
    }
};

export const eliminarVideo = async (req, res) => {
    const { videoNombre } = req.body;

    try {
        const videoPath = `C:/Users/Kevin/Desktop/Programa Turnos/turnos_backend/videos/${videoNombre}`;
        // Verifica si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
            res.send('Video eliminado correctamente');
        } else {
            res.status(404).send('El video no existe');
        }
    } catch (error) {
        console.error('Error al eliminar el video:', error);
        res.status(500).send('Error al eliminar el video');
    }
};

// Nuevo endpoint para obtener la lista de videos
export const obtenerListaVideos = async (req, res) => {
    try {
        const videosPath = 'C:/Users/Kevin/Desktop/Programa Turnos/turnos_backend/videos';
        const videos = fs.readdirSync(videosPath);

        // Construir una lista de objetos con el nombre y la dirección del video
        const listaVideos = videos.map(video => ({
            nombre: video,
            url: `http://localhost:8000/videos/${video}` // URL HTTP del video
        }));
        res.json(listaVideos);
    } catch (error) {
        console.error('Error al obtener la lista de videos:', error);
        res.status(500).send('Error al obtener la lista de videos');
    }
};