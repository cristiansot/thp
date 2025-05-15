import express from 'express';
import { sendFormEmail } from '../services/mail.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  const { nombre, correo, asunto } = req.body;

  // Llamamos a la función sendFormEmail para enviar el correo
  const emailSent = await sendFormEmail({ nombre, correo, asunto });

  if (emailSent) {
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } else {
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
});

export default router;
