import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // 🔥 importante: sin path en EC2

// 🔥 función reutilizable para no repetir código
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, // automático
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 🔍 verificar conexión SMTP (clave para debug)
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado correctamente");
  } catch (error) {
    console.error("❌ Error conexión SMTP:", error.message);
    throw error;
  }

  return transporter;
};

// 📩 Envío de mail por cambio de estado
const sendEmailNotification = async (property) => {
  try {
    console.log('Propiedad recibida:', property);

    if (!property || !property.title || !property.status) {
      console.log('❌ Faltan datos en la propiedad');
      return;
    }

    if (property.status === 'active') {
      console.log('ℹ️ Estado activo, no se envía correo');
      return;
    }

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Notificación de cambio de estado de propiedad',
      text: `La propiedad "${property.title}" cambió a estado: "${property.status}"`,
    });

    console.log('📬 Correo enviado:', info.response);

  } catch (error) {
    console.error('❌ Error en sendEmailNotification:', error);
  }
};

// 📩 Envío de mail por cambio de precio
const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"THP Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('📬 Correo enviado (precio):', info.response);

  } catch (error) {
    console.error('❌ Error envío precio:', error);
  }
};

// 📩 Formulario de contacto (IMPORTANTE)
const sendFormEmail = async ({ nombre, correo, asunto }) => {
  try {
    console.log("📨 Datos recibidos:", { nombre, correo, asunto });

    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos");
      return false;
    }

    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"THP Web" <${process.env.EMAIL_USER}>`,
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
    console.error('❌ Error formulario:', error);
    return false;
  }
};

export {
  sendEmail,
  sendEmailNotification,
  sendFormEmail
};