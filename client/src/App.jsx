import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ContainerCard from './components/ContainerCards';
import Carousel from './components/Carousel';
import NavBar from './components/Navbar';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchDetailedProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5173/api/properties/detailed');
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

    fetchDetailedProperties();
  }, []);


  return (
    <Router>
      <div>
        <NavBar />
        <Carousel />
        <ContainerCard properties={properties} loading={loading} error={error} />
      </div>
    </Router>
  );
}

export default App;
