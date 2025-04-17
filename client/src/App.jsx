import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import CategorySearch from './components/CategorySearch';

function App() {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Verifica si hay un access_token en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    console.log('URL Params:', window.location.search);  // Imprime la URL para verificar los parámetros

    if (accessToken) {
      console.log('Access Token recibido de URL:', accessToken);
      // Guarda el access_token en el localStorage
      localStorage.setItem('access_token', accessToken);
    }

    // Llama a la función para obtener los datos del usuario
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Obtiene el access_token del localStorage
    const accessToken = localStorage.getItem('access_token');
    
    // Si no se encuentra el access_token, muestra un mensaje de error
    if (!accessToken) {
      console.error('❌ No access token found');
      return;
    }

    try {
      // Realiza una solicitud a la API de Mercado Libre con el access_token
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  return (
    <Router>
      <div>
        {/* Ya no necesitas el botón de login, así que lo eliminamos */}
        {property && (
          <div>
            <h2>{property.title}</h2>
            <p>Price: ${property.price}</p>
            <img src={property.image} alt="Property" style={{ width: '300px' }} />
          </div>
        )}
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
                <Route path="/categories" element={<CategorySearch />} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
