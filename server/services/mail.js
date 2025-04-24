import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Usar import en lugar de require
dotenv.config(); // Cargar las variables de entorno

const sendEmailNotification = (property) => {
  console.log('Propiedad recibida en backend:', property); // Verificar que el backend recibe la propiedad correctamente

  if (!property || !property.title || !property.status) {
    console.log('Faltan datos en la propiedad:', property);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
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

export { sendEmailNotification };
