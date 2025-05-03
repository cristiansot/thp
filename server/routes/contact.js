import express from 'express';
import sendMail from '../services/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, correo, asunto } = req.body;

  try {
    await sendMail({
      to: 'tucorreo@tudominio.com',
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${asunto}`,
    });

    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

export default router;
