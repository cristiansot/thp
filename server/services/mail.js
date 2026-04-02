import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Usar import en lugar de require
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, '.env')
});

// Envío de mail por cambio de estado
const sendEmailNotification = (property) => {
  console.log('Propiedad recibida en backend:', property); // Verificar que el backend recibe la propiedad correctamente

  // Verificar que la propiedad tenga los datos necesarios
  if (!property || !property.title || !property.status) {
    console.log('Faltan datos en la propiedad:', property);
    return;
  }

  // Enviar correo solo si el estado es distinto de "active"
  if (property.status === 'active') {
    console.log(`El estado de la propiedad es "${property.status}". No se enviará el correo.`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `Notificación de cambio de estado de propiedad`,
    text: `La propiedad con título: "${property.title}" ha cambiado de estado a: "${property.status}".`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// Envío de mail por cambio de precio
async function sendEmail({ to, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"THP Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('📬 Correo enviado (precio):', info.response);
  } catch (error) {
    console.error('❌ Error al enviar correo (precio):', error.message);
  }
}

// Función de envío de correo para el formulario de contacto
async function sendFormEmail({ nombre, correo, asunto }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // Usar 'true' para SSL en el puerto 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${asunto}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📬 Correo enviado:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message, error.stack);
    return false;
  }
  
}

export { sendEmail, sendEmailNotification, sendFormEmail };
