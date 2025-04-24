// mail.js

import nodemailer from 'nodemailer';
require('dotenv').config();

const sendEmailNotification = (property) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
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

// Exportación por defecto
export default sendEmailNotification;
