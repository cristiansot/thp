import React, { useEffect } from 'react';
import axios from 'axios';

const Mail = ({ property }) => {
  useEffect(() => {
    console.log('Propiedad recibida:', property); // Verifica si la propiedad es la correcta
    if (property && property.status !== 'active') { // Asegúrate de que 'property' no sea undefined o null
      sendNotificationEmail(property);
    }
  }, [property]);


  const sendNotificationEmail = async (property) => {
    try {
      console.log('Enviando correo de notificación...'); // Verifica que la función se esté llamando
      // Verifica que el formato de la propiedad sea correcto
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email`, { property });
    } catch (error) {
      console.error('Error al enviar la notificación por correo:', error);
    }
  };
};

export default Mail;
