import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Intentamos obtener el token del backend
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get('/api/access_token');
        const { access_token } = response.data;
        if (access_token) {
          console.log("Access Token recibido:", access_token);
          fetchUserData(access_token); // Llamada a la API con el token
        } else {
          console.log("No se encontró access_token en el servidor.");
        }
      } catch (error) {
        console.error("Error al obtener el access_token:", error.message);
      }
    };

    fetchAccessToken();
  }, []);

  const fetchUserData = async (accessToken) => {
    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data);
      setUserData(response.data);  // Actualiza el estado con los datos del usuario
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error.message);
    }
  };

  return (
    <div>
      {userData ? (
        <div>
          <h2>Bienvenido {userData.nickname}</h2>
          <p>ID de usuario: {userData.id}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default App;
