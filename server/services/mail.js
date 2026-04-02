import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verificar variables de entorno
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_TO'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Faltan variables de entorno:', missingVars.join(', '));
  console.error('📝 Asegúrate de tener un archivo .env con:');
  console.error(`
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tuemail@gmail.com
EMAIL_PASSWORD=tucontraseñadeapp
EMAIL_TO=destinatario@gmail.com
EMAIL_FROM="Tu Nombre" <tuemail@gmail.com>
  `);
}

// Configuración con validación
const smtpConfig = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Opciones adicionales para depuración
  debug: true,
  logger: true,
};

console.log('📧 Configuración SMTP:', {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  user: smtpConfig.auth.user ? '✅ definido' : '❌ faltante',
  pass: smtpConfig.auth.pass ? '✅ definido' : '❌ faltante',
});

// Crear transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Verificar conexión SMTP
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error conexión SMTP:", error.message);
    console.error("🔧 Sugerencias:");
    console.error("  1. Verifica que el host y puerto son correctos");
    console.error("  2. Si usas Gmail, necesitas 'Contraseña de aplicación'");
    console.error("  3. Revisa que el puerto 587 o 465 esté abierto");
    console.error("  4. Verifica que el usuario/contraseña sean correctos");
    return false;
  }
};

// Verificar al inicio
let isConnected = false;
(async () => {
  isConnected = await verifyConnection();
})();

// Helper para FROM
const getFrom = () => {
  return process.env.EMAIL_FROM || `"THP" <${process.env.EMAIL_USER}>`;
};

// 📩 Envío de mail por cambio de estado
const sendEmailNotification = async (property) => {
  if (!isConnected) {
    console.error('❌ No hay conexión SMTP, reintentando...');
    isConnected = await verifyConnection();
    if (!isConnected) return;
  }

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

    const mailOptions = {
      from: getFrom(),
      to: process.env.EMAIL_TO,
      subject: 'Notificación de cambio de estado de propiedad',
      text: `La propiedad "${property.title}" cambió a estado: "${property.status}"`,
      html: `<p>La propiedad <strong>${property.title}</strong> cambió a estado: <strong>${property.status}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado (estado):', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Error en sendEmailNotification:', error.message);
    console.error('📋 Detalles:', error);
  }
};

// 📩 Envío de mail por cambio de precio
const sendEmail = async ({ to, subject, text }) => {
  if (!isConnected) {
    console.error('❌ No hay conexión SMTP');
    return;
  }

  try {
    if (!to || !subject || !text) {
      console.log('❌ Faltan datos para enviar correo');
      console.log('📝 Necesitas: to, subject, text');
      return;
    }

    const mailOptions = {
      from: `"THP Monitor" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, '<br>')}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado (precio):', info.messageId);
    return info;

  } catch (error) {
    console.error('❌ Error envío precio:', error.message);
  }
};

// 📩 Formulario de contacto
const sendFormEmail = async ({ nombre, correo, asunto }) => {
  if (!isConnected) {
    console.error('❌ No hay conexión SMTP');
    return false;
  }

  try {
    console.log("📨 Datos recibidos:", { nombre, correo, asunto });

    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos");
      return false;
    }

    const mailOptions = {
      from: getFrom(),
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `
Nombre: ${nombre}
Correo: ${correo}
Mensaje: ${asunto}
      `,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Mensaje:</strong> ${asunto}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado (formulario):', info.messageId);
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
  verifyConnection,
};