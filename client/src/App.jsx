// App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/Navbar';
import MapView from './components/MapView';
import Filters from './components/Filters';
import Whatsapp from './components/Whatsapp'

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const fetchDetailedProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/detailed`);
      setProperties(response.data);
      setFilteredProperties(response.data);
      console.log("Propiedades obtenidas:", response.data);
    } catch (error) {
      console.error('Error fetching properties:', error.response?.data || error.message);
      setError('Error al obtener las propiedades. Por favor, inténtalo de nuevo más tarde.');
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
        <NavBar />
        <Carousel />
        <Whatsapp />
        <Filters
          properties={properties}
          setFilteredProperties={setFilteredProperties}
          showMap={showMap}
          setShowMap={setShowMap}
        />
        {
          showMap
            ? <MapView properties={filteredProperties} zoom={13} />
            : <ContainerCard properties={filteredProperties} loading={loading} error={error} />
        }
      </div>
    </Router>
  );
}

export default App;
