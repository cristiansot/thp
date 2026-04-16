import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ===============================
// 📧 CONFIG SMTP (Titan)
// ===============================
const smtpConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true,
};

console.log('📧 Configuración SMTP:', {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  user: smtpConfig.auth.user ? '✅ definido' : '❌ faltante',
});

const transporter = nodemailer.createTransport(smtpConfig);

let isConnected = false;
let connectionPromise = null;

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

ensureConnection();

const getFrom = () => {
  // Usar el mismo email que el usuario SMTP
  return `"Total Home Propiedades" <${process.env.EMAIL_USER}>`;
};

// ===============================
// 🔒 VALIDACIONES ANTISPAM
// ===============================
const isSuspiciousEmail = (correo) => {
  if (!correo.includes("@")) return true;

  const blockedPatterns = [
    "test",
    "noreply",
    "fake",
    "temp",
    "mailinator",
    "yopmail"
  ];

  return blockedPatterns.some(p => correo.toLowerCase().includes(p));
};

// ===============================
// 📩 NOTIFICACIÓN PROPIEDADES
// ===============================
export const sendEmailNotification = async (property) => {
  try {
    await ensureConnection();

    if (!property?.title || !property?.status) return;
    if (property.status === 'active') return;

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

// ===============================
// 📩 ENVÍO GENÉRICO
// ===============================
export const sendEmail = async ({ to, subject, text }) => {
  try {
    await ensureConnection();

    if (!to || !subject || !text) return;

    const info = await transporter.sendMail({
      from: `"THP Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('✅ Correo enviado (genérico):', info.response);
    return info;

  } catch (error) {
    console.error('❌ Error envío genérico:', error.message);
  }
};

// ===============================
// 📩 FORMULARIO CONTACTO (PROTEGIDO)
// ===============================
export const sendFormEmail = async ({ nombre, correo, asunto }) => {
  try {
    await ensureConnection();

    console.log("📨 Datos recibidos:", { nombre, correo, asunto });

    // 🔒 Validaciones básicas
    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos");
      return false;
    }

    // 🔒 Validación formato correo
    if (!correo.includes("@") || correo.length > 100) {
      console.log("❌ Correo inválido");
      return false;
    }

    // 🔒 Anti-spam básico
    if (isSuspiciousEmail(correo)) {
      console.log("🚫 Correo sospechoso bloqueado:", correo);
      return false;
    }

    // 🔒 Limitar tamaño mensaje
    if (asunto.length > 1000) {
      console.log("🚫 Mensaje demasiado largo");
      return false;
    }

    const info = await transporter.sendMail({
      from: getFrom(),
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\nMensaje: ${asunto}`,
    });

    console.log('✅ Correo enviado (formulario):', info.response);
    return true;

  } catch (error) {
    console.error('❌ Error formulario:', error.message);
    return false;
  }
};