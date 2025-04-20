import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  // Flag para evitar llamadas duplicadas en desarrollo con StrictMode
  const hasFetched = useRef(false);

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data.id);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  const fetchPropertiesFromML = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('http://localhost:5173/api/properties', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Productos del vendedor:', response.data);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    if (hasFetched.current) return; // Evita que se ejecute dos veces
    hasFetched.current = true;

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
    fetchPropertiesFromML();
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

        <h1>Publicaciones del Vendedor</h1>
        <ul>
          {properties.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>

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
