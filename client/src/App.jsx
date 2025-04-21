import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/Navbar';
import MapView from './components/MapView';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el token del backend y guardarlo en el localStorage
  const fetchTokenFromBackend = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/token`);
      if (response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
    } catch (error) {
      console.error('Error al obtener el token del backend:', error);
    }
  };

  // Obtener propiedades detalladas
  const fetchDetailedProperties = async () => {
    const accessToken = localStorage.getItem('access_token');
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/detailed`, {
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
    // Primero obtenemos el token
    fetchTokenFromBackend();
    // Luego obtenemos las propiedades detalladas
    fetchDetailedProperties();
  }, []);

  return (
    <Router>
      <div>
        <MapView properties={properties} zoom={13} />
        <NavBar />
        <Carousel />
        <ContainerCard properties={properties} loading={loading} error={error} />
      </div>
    </Router>
  );
}

export default App;
