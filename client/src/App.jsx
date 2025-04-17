import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import CategorySearch from './components/CategorySearch';

function App() {
  const [property, setProperty] = useState(null);
  const [products, setProducts] = useState([]);  // Estado para los productos

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const title = urlParams.get('title');
    const price = urlParams.get('price');
    const image = urlParams.get('image');

    if (accessToken) {
      console.log('Access Token:', accessToken);
      localStorage.setItem('access_token', accessToken);
    }

    if (title && price && image) {
      setProperty({ title, price, image });
    }

    fetchUserData();
    fetchProducts('laptop', 'MLA');  // Buscar productos de ejemplo
  }, []);

  const handleLogin = () => {
    const isDev = import.meta.env.MODE === 'development';
    const loginUrl = isDev
      ? import.meta.env.VITE_ML_LOGIN_DEV
      : import.meta.env.VITE_ML_LOGIN_PROD;

    window.location.href = loginUrl;
  };

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  const fetchProducts = async (query, site) => {
    try {
      const response = await axios.get('http://localhost:10000/api/products', {
        params: { query, site },
      });
      setProducts(response.data.results || []);  // Guardar los productos en el estado
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  return (
    <Router>
      <div>
        <button onClick={handleLogin}>Login with Mercado Libre</button>
        {property && (
          <div>
            <h2>{property.title}</h2>
            <p>Price: ${property.price}</p>
            <img src={property.image} alt="Property" style={{ width: '300px' }} />
          </div>
        )}
        
        <div>
          <h2>Productos</h2>
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  <img src={product.thumbnail} alt={product.title} style={{ width: '100px' }} />
                  <h3>{product.title}</h3>
                  <p>Price: ${product.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>

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
