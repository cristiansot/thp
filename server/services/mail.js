// services/mail.js - Versión corregida
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración SMTP
const smtpConfig = {
  host: 'smtp.titan.email',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'TLSv1.2',
    minVersion: 'TLSv1.2'
  },
  debug: true,
  logger: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

// Crear transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Variable para estado de conexión
let isConnected = false;
let connectionPromise = null;

// Función para conectar (solo una vez)
async function ensureConnection() {
  if (isConnected) return true;
  
  if (!connectionPromise) {
    connectionPromise = transporter.verify()
      .then(() => {
        isConnected = true;
        console.log("✅ SMTP conectado correctamente");
        return true;
      })
      .catch((error) => {
        console.error("❌ Error conexión SMTP:", error.message);
        connectionPromise = null;
        return false;
      });
  }
  
  return connectionPromise;
}

// Iniciar conexión automáticamente
ensureConnection();

// Helper para FROM
const getFrom = () => {
  return process.env.EMAIL_FROM || `"THP" <${process.env.EMAIL_USER}>`;
};

// 📩 Envío de mail por cambio de estado
export const sendEmailNotification = async (property) => {
  try {
    await ensureConnection(); // Esperar conexión
    
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

    console.log('✅ Correo enviado (estado):', info.response);
    return info;

  } catch (error) {
    console.error('❌ Error en sendEmailNotification:', error.message);
  }
};

// 📩 Envío de mail por cambio de precio
export const sendEmail = async ({ to, subject, text }) => {
  try {
    await ensureConnection(); // Esperar conexión
    
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

    console.log('✅ Correo enviado (precio):', info.response);
    return info;

  } catch (error) {
    console.error('❌ Error envío precio:', error.message);
  }
};

// 📩 Formulario de contacto
export const sendFormEmail = async ({ nombre, correo, asunto }) => {
  try {
    await ensureConnection(); // Esperar conexión
    
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

    console.log('✅ Correo enviado (formulario):', info.response);
    return true;

  } catch (error) {
    console.error('❌ Error formulario:', error.message);
    return false;
  }
};