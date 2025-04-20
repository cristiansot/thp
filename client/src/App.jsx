import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/Navbar';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);
      const response = await axios.get('http://localhost:5173/api/properties/detailed', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProperties(response.data);
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
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

    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (title && price && image) setProperties({ title, price, image });

    fetchUserData();
    fetchDetailedProperties();
  }, []);

  // const handleLogin = () => {
  //   const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${import.meta.env.VITE_ML_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
  //   window.location.href = loginUrl;
  // };

  return (
    <Router>
      <div style={{ padding: '2rem' }}>
        {/* <button onClick={handleLogin}>Login con Mercado Libre</button> */}

        <NavBar />
        <Carousel />
        <ContainerCard properties={properties} loading={loading} error={error} />

        {/* <Routes>
          <Route path="/" element={<h1>Pagina protegida para usuarios logeados</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
              </ProtectedRoute>
            }
          />
        </Routes> */}

      </div>
    </Router>
  );
}

export default App;
