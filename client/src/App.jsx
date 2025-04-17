import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [property, setProperty] = useState(null);

  // Obtener datos del usuario logueado
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data.address);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  // Procesar parámetros de la URL y cargar datos iniciales
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const title = urlParams.get('title');
    const price = urlParams.get('price');
    const image = urlParams.get('image');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }

    if (title && price && image) {
      setProperty({ title, price, image });
    }

    fetchUserData();
  }, []);

  const handleLogin = () => {
    const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${import.meta.env.VITE_ML_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
    window.location.href = loginUrl;
  };
  
  return (
    <Router>
      <div>
        <button onClick={handleLogin}>Login con Mercado Libre</button>

        {property && (
          <div>
            <h2>{property.title}</h2>
            <p>Precio: ${property.price}</p>
            <img src={property.image} alt="Propiedad" style={{ width: '300px' }} />
          </div>
        )}

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
