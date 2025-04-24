import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Mail = ({ property }) => {
  // Usamos el estado para mantener el status previo
  const [previousStatus, setPreviousStatus] = useState(property.status);

  useEffect(() => {
    // Solo enviamos el correo si el estado ha cambiado y no es 'active'
    if (property.status !== previousStatus && property.status !== 'active') {
      sendNotificationEmail(property);
      setPreviousStatus(property.status); // Actualizamos el estado previo
    }
  }, [property, previousStatus]); // Dependemos de property y previousStatus

  const sendNotificationEmail = async (property) => {
    try {
      // Llamar a tu backend para enviar el correo
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-email`, { property });
    } catch (error) {
      console.error('Error al enviar la notificación por correo:', error);
    }
  };

  return null;
};

export default Mail;
