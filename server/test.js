import { sendEmail, verifyConnection } from './tu-archivo.js';

async function test() {
  console.log('🧪 Probando conexión...');
  const connected = await verifyConnection();
  
  if (connected) {
    console.log('🧪 Enviando correo de prueba...');
    await sendEmail({
      to: 'destinatario@test.com',
      subject: 'Prueba de correo',
      text: 'Este es un correo de prueba desde Nodemailer'
    });
  }
}

test();