import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [property, setProperty] = useState(null);
  const [products, setProducts] = useState([]); // Estado para almacenar los productos

  // Obtener datos del usuario logueado
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data.address);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  // Obtener productos desde el backend
  const fetchProducts = async () => {
    try {
      const sellerId = 'TU_SELLER_ID'; // Reemplaza esto con el ID del vendedor que deseas buscar
      const response = await axios.get('http://localhost:3001/api/products', {
        params: { seller_id: sellerId, site: 'MLC', page: 1, sort: 'price_asc' },
      });
      console.log('Productos del vendedor:', response.data);
      setProducts(response.data); // Guardar los productos en el estado
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
    }
  };
  // Procesar parámetros de la URL y cargar datos iniciales
  useEffect(() => {
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
    fetchProducts(); // Llamar a la función para obtener productos
  }, []);

  const handleLogin = () => {
    const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${import.meta.env.VITE_ML_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  return (
    <Router>
      <div>
        <button onClick={handleLogin}>Login con Mercado Libre</button>

        {property && (
          <div>
            <h2>{property.title}</h2>
            <p>Precio: ${property.price}</p>
            <img src={property.image} alt="Propiedad" style={{ width: '300px' }} />
          </div>
        )}

        <h1>Productos</h1>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.title}</h2>
              <p>Precio: ${product.price}</p>
              <img src={product.thumbnail} alt={product.title} />
            </li>
          ))}
        </ul>

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