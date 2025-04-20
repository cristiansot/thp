import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products', {
        params: {
          seller_id: 1628129303, // o el que desees
          site: 'MLC',
          page: 1,
          sort: 'price_asc', // o 'price_desc', etc.
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('No se pudieron cargar los productos.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Productos del Vendedor</h2>
      {error && <p>{error}</p>}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.title}</strong><br />
              Precio: ${product.price} <br />
              <img src={product.thumbnail} alt={product.title} width={100} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos para mostrar.</p>
      )}
    </div>
  );
};

export default ProductList;
