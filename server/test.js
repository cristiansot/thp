// test.js - Versión corregida
// Cambia la importación según tu estructura real

// Opción 1: Si tu archivo de email está en services/emailService.js
import { sendFormEmail } from './services/emailService.js';

// Opción 2: Si tu archivo de email está en la raíz con otro nombre
// import { sendFormEmail } from './emailService.js';

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