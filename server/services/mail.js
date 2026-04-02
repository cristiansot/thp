import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  requireTLS: true,
});

// 🔥 verificar conexión UNA vez
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado correctamente");
  } catch (error) {
    console.error("❌ SMTP ERROR:", error);
  }
})();

const sendFormEmail = async (data) => {
  try {
    console.log("📨 BODY RECIBIDO:", data);

    const nombre = data.nombre || data.name;
    const correo = data.correo || data.email;
    const asunto = data.asunto || data.message;

    if (!nombre || !correo || !asunto) {
      console.log("❌ Datos incompletos:", { nombre, correo, asunto });
      return false;
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // 🔥 CLAVE
      to: process.env.EMAIL_TO,
      replyTo: correo,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `
Nombre: ${nombre}
Correo: ${correo}

Mensaje:
${asunto}
      `,
    });

    console.log("✅ EMAIL ENVIADO:", info.response);
    return true;

  } catch (error) {
    console.error("❌ ERROR REAL:", error);
    return false;
  }
};

export { sendFormEmail };