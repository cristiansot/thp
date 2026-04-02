import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 🔥 Crear transporter UNA sola vez
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: Number(process.env.EMAIL_PORT) === 465, // true solo si puerto 465
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  requireTLS: true, // 🔥 IMPORTANTE
  tls: {
    ciphers: 'SSLv3',
  },
});

// 🔍 Verificar conexión SMTP al iniciar
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado correctamente");
  } catch (error) {
    console.error("❌ Error conexión SMTP:", error.message);
  }
})();

// 🔥 Helper para FROM
const getFrom = () => {
  return process.env.EMAIL_FROM || `"THP" <${process.env.EMAIL_USER}>`;
};

// 📩 Envío de mail por cambio de estado
const sendEmailNotification = async (property) => {
  try {
    console.log('📦 Propiedad recibida:', property);

    if (!property?.title || !property?.status) {
      console.log('❌ Faltan datos en la propiedad');
      return;
    }

    if (property.status === 'active') {
      console.log('ℹ️ Estado activo, no se envía correo');
      return;
    }

    const info = await transporter.sendMail({
      from: getFrom(),
      to: process.env.EMAIL_TO,
      subject: 'Notificación de cambio de estado de propiedad',
      text: `La propiedad "${property.title}" cambió a estado: "${property.status}"`,
    });

    console.log('📬 Correo enviado (estado):', info.response);

  } catch (error) {
    console.error('❌ Error en sendEmailNotification:', error.message);
  }
};

// 📩 Envío de mail por cambio de precio
const sendEmail = async ({ to, subject, text }) => {
  try {
    if (!to || !subject || !text) {
      console.log('❌ Faltan datos para enviar correo');
      return;
    }

    const info = await transporter.sendMail({
      from: `"THP Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('📬 Correo enviado (precio):', info.response);

  } catch (error) {
    console.error('❌ Error envío precio:', error.message);
  }
};

// 📩 Formulario de contacto
const sendFormEmail = async ({ nombre, correo, asunto }) => {
  try {
    console.log("📨 Datos recibidos:", { nombre, correo, asunto });

    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos");
      return false;
    }

    const info = await transporter.sendMail({
      from: getFrom(),
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `
Nombre: ${nombre}
Correo: ${correo}
Mensaje: ${asunto}
      `,
    });

    console.log('📬 Correo enviado (formulario):', info.response);
    return true;

  } catch (error) {
    console.error('❌ Error formulario:', error.message);
    return false;
  }
};

export {
  sendEmail,
  sendEmailNotification,
  sendFormEmail,
};