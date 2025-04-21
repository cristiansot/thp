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
  const fetchToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/token`);
      localStorage.setItem('access_token', response.data.access_token);
    } catch (error) {
      console.error('Error al obtener el token del backend:', error.response?.data || error.message);
  
      // Si el token no está disponible, intenta refrescarlo
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`);
          localStorage.setItem('access_token', refreshResponse.data.access_token);
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError.message);
        }
      }
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
    fetchToken(); 
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
