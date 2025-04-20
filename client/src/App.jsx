import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [property, setProperty] = useState(null);
  const [properties, setProperties] = useState([]);

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

  const fetchDetailedProperties = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('http://localhost:5173/api/properties/detailed', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Propiedades detalladas:', response.data);
      setProperties(response.data);
    } catch (error) {
      console.error('Error al obtener detalles:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
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
    fetchDetailedProperties();
  }, []);

  const handleLogin = () => {
    const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${import.meta.env.VITE_ML_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        <button onClick={handleLogin}>Login con Mercado Libre</button>

        {property && (
          <div style={{ margin: '2rem 0' }}>
            <h2>{property.title}</h2>
            <p>Precio: ${property.price}</p>
            <img src={property.image} alt="Propiedad" style={{ width: '300px' }} />
          </div>
        )}

        <h1>Publicaciones del Vendedor</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {properties.map((prop) => (
            <div
              key={prop.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                width: '300px',
              }}
            >
              <h3>{prop.title}</h3>
              <p>Precio: ${prop.price}</p>
              <p>Dormitorios: {prop.bedrooms || 'N/A'}</p>
              <p>Baños: {prop.bathrooms || 'N/A'}</p>
              <p>Área cubierta: {prop.covered_area || 'N/A'} m²</p>
              {prop.image && (
                <img
                  src={prop.image}
                  alt={prop.title}
                  style={{ width: '100%', borderRadius: '4px', marginTop: '0.5rem' }}
                />
              )}
            </div>
          ))}
        </div>

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
