import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/Navbar';
import MapView from './components/MapView';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetailedProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/properties/detailed`);
      setProperties(response.data);
    } catch (error) {
      setError(error.response?.data || error.message);
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
        <MapView lat={-33.45} lng={-70.6667} zoom={13} />
        <NavBar />
        <Carousel />
        <ContainerCard properties={properties} loading={loading} error={error} />
      </div>
    </Router>
  );
}

export default App;
