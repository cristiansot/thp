import React, { useEffect } from 'react';
import axios from 'axios';

const Mail = ({ property }) => {
  useEffect(() => {
    console.log('Propiedad recibida:', property); // Verifica si la propiedad es la correcta
    if (property.status !== 'active') {
      sendNotificationEmail(property);
    }
  }, [property]);

  const sendNotificationEmail = async (property) => {
    try {
      console.log('Enviando correo de notificación...'); // Asegúrate de que se esté llamando a la función
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email`, { property });
    } catch (error) {
      console.error('Error al enviar la notificación por correo:', error);
    }
  };

  return null;
};

export default Mail;
