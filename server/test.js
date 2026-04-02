// test.js - Versión corregida para tu estructura
import { sendFormEmail } from './services/mail.js';

async function test() {
  console.log('🧪 Probando envío de email...');
  
  const result = await sendFormEmail({
    nombre: 'Usuario Prueba',
    correo: 'test@example.com',
    asunto: 'Mensaje de prueba desde terminal'
  });
  
  if (result) {
    console.log('✅ Email enviado correctamente');
  } else {
    console.log('❌ Error al enviar email');
  }
}

test();