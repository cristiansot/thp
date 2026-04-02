// routes/contact.js
import express from 'express';
import { sendFormEmail } from '../services/mail.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('='.repeat(50));
  console.log('📨 POST /api/contact recibido');
  console.log('📨 Headers:', {
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent']?.substring(0, 50)
  });
  console.log('📨 Body completo:', req.body);
  console.log('📨 Campos:', Object.keys(req.body));
  
  const { nombre, correo, asunto } = req.body;

  // Validación más clara
  if (!nombre || !correo || !asunto) {
    console.log('❌ Validación fallida:', {
      nombre: nombre ? 'OK' : 'FALTA',
      correo: correo ? 'OK' : 'FALTA',
      asunto: asunto ? 'OK' : 'FALTA'
    });
    return res.status(400).json({ 
      success: false,
      message: 'Faltan datos requeridos',
      missing: {
        nombre: !nombre,
        correo: !correo,
        asunto: !asunto
      }
    });
  }

  try {
    console.log('📧 Intentando enviar email...');
    const emailSent = await sendFormEmail({ nombre, correo, asunto });
    
    console.log('📧 Resultado sendFormEmail:', emailSent);
    
    if (emailSent) {
      console.log('✅ Email enviado con éxito');
      res.status(200).json({ 
        success: true,
        message: 'Correo enviado con éxito' 
      });
    } else {
      console.log('❌ sendFormEmail retornó false');
      res.status(500).json({ 
        success: false,
        message: 'Error al enviar el correo' 
      });
    }
  } catch (error) {
    console.error('❌ Error en try-catch:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
  
  console.log('='.repeat(50));
});

export default router;