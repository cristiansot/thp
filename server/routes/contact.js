// routes/contact.js
import express from 'express';
import { sendFormEmail } from '../services/mail.js';

const router = express.Router();

// Función para verificar token de Turnstile
async function verifyTurnstileToken(token, ip) {
  // Si no hay token, rechazar
  if (!token) return false;
  
  const secret = process.env.TURNSTILE_SECRET_KEY;
  
  // Si no hay secret key en desarrollo, permitir (opcional)
  if (!secret && process.env.NODE_ENV === 'development') {
    console.log('⚠️ Modo desarrollo: saltando verificación de Turnstile');
    return true;
  }
  
  if (!secret) {
    console.error('❌ TURNSTILE_SECRET_KEY no configurada');
    return false;
  }
  
  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  formData.append('remoteip', ip);
  
  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    
    const outcome = await result.json();
    console.log('🔒 Turnstile verification:', outcome.success ? '✅ OK' : '❌ Failed', outcome);
    return outcome.success === true;
  } catch (error) {
    console.error('❌ Error verifying Turnstile:', error);
    return false;
  }
}

router.post('/', async (req, res) => {
  console.log('='.repeat(50));
  console.log('📨 POST /api/contact recibido');
  console.log('📨 Headers:', {
    origin: req.headers.origin,
    'content-type': req.headers['content-type']
  });
  console.log('📨 Body:', req.body);
  
  const { nombre, correo, asunto, token, website } = req.body;

  // 🧠 Honeypot - si website tiene valor, es un bot
  if (website) {
    console.log('🚫 Honeypot detectado - Bot bloqueado');
    return res.status(400).json({ 
      success: false,
      message: 'Solicitud inválida'
    });
  }

  // 🔒 Validar token de Turnstile
  if (!token) {
    console.log('❌ Token de Turnstile faltante');
    return res.status(400).json({ 
      success: false,
      message: 'Por favor verifica el captcha'
    });
  }
  
  // Verificar token con Cloudflare
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const isValidCaptcha = await verifyTurnstileToken(token, clientIP);
  
  if (!isValidCaptcha) {
    console.log('❌ Token de Turnstile inválido');
    return res.status(400).json({ 
      success: false,
      message: 'Captcha inválido, intenta nuevamente'
    });
  }

  // Validar campos requeridos
  if (!nombre || !correo || !asunto) {
    console.log('❌ Validación fallida:', {
      nombre: !!nombre,
      correo: !!correo,
      asunto: !!asunto
    });
    return res.status(400).json({ 
      success: false,
      message: 'Faltan datos requeridos'
    });
  }

  try {
    console.log('📧 Intentando enviar email...');
    const emailSent = await sendFormEmail({ nombre, correo, asunto });
    
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
        message: 'Error al enviar el correo. Por favor intenta más tarde.' 
      });
    }
  } catch (error) {
    console.error('❌ Error en try-catch:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;