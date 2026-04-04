import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/NavBar'
import MapView from './components/MapView';
import Filters from './components/Filters';
import Whatsapp from './components/Whatsapp';
import Footer from './components/Footer';
import SeoSection from './components/SeoSection';

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // 🔧 Función helper para construir URLs correctamente
  const buildApiUrl = (endpoint) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  };

  const fetchDetailedProperties = async () => {
    try {
      setLoading(true);
      // ✅ Usar la función helper
      const url = buildApiUrl('api/properties/detailed');
      console.log('📡 Fetching properties from:', url); // Para debugging
      
      const response = await axios.get(url);
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error.response?.data || error.message);
      setError('Error al obtener las propiedades. Por favor inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailedProperties();
  }, []);

  return (
    <Router>
      <div>
        <section id="home">
          <NavBar />
        </section>
    
          <Carousel />
          <Whatsapp />
          <Filters
            properties={properties}
            setFilteredProperties={setFilteredProperties}
            showMap={showMap}
            setShowMap={setShowMap}
          />
          <SeoSection />
          {
            showMap
              ? <MapView properties={filteredProperties} zoom={13} />
              : <ContainerCard properties={filteredProperties} loading={loading} error={error} />
          } 
        <section id="contacto">
          <Footer />
        </section>
      </div>
    </Router>
  );
}

export default App;