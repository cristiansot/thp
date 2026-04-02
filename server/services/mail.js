import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Transporter limpio y compatible con Titan
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // 🔥 SIEMPRE false en 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  requireTLS: true,
});

// 🔍 Verificar conexión SMTP al iniciar
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado correctamente");
  } catch (error) {
    console.error("❌ Error conexión SMTP:", error); // 🔥 error completo
  }
})();

// 🔥 FROM SIEMPRE IGUAL AL USER (clave para Titan)
const getFrom = () => process.env.EMAIL_USER;

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
    console.error('❌ Error en sendEmailNotification:', error);
  }
};

// 📩 Envío de mail genérico (precio u otros)
const sendEmail = async ({ to, subject, text }) => {
  try {
    if (!to || !subject || !text) {
      console.log('❌ Faltan datos para enviar correo');
      return;
    }

    const info = await transporter.sendMail({
      from: getFrom(),
      to,
      subject,
      text,
    });

    console.log('📬 Correo enviado:', info.response);

  } catch (error) {
    console.error('❌ Error envío:', error);
  }
};

// 📩 FORMULARIO DE CONTACTO (CORREGIDO)
const sendFormEmail = async (data) => {
  try {
    console.log("📨 BODY RECIBIDO:", data);

    // 🔥 soporta distintos nombres desde frontend
    const nombre = data.nombre || data.name;
    const correo = data.correo || data.email;
    const asunto = data.asunto || data.message;

    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos");
      return false;
    }

    const info = await transporter.sendMail({
      from: getFrom(), // 🔥 clave
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      replyTo: correo, // 🔥 MUY IMPORTANTE (para responder al cliente)
      text: `
Nombre: ${nombre}
Correo: ${correo}

Mensaje:
${asunto}
      `,
    });

    console.log('📬 Correo enviado (formulario):', info.response);
    return true;

  } catch (error) {
    console.error('❌ Error formulario:', error);
    return false;
  }
};

export {
  sendEmail,
  sendEmailNotification,
  sendFormEmail,
};