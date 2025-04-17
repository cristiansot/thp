import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import CategorySearch from './components/CategorySearch';

function App() {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const title = urlParams.get('title');
    const price = urlParams.get('price');
    const image = urlParams.get('image');

    if (accessToken) {
      console.log('Access Token recibido de URL:', accessToken);
      localStorage.setItem('access_token', accessToken);
    }

    if (title && price && image) {
      setProperty({ title, price, image });
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('❌ No access token found');
      return;
    }

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('✅ Conectado a la API de Mercado Libre');
      console.log('User Data:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  return (
    <Router>
      <div>
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
