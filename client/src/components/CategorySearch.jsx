import React, { useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard'; // Importar el componente PropertyCard
import '../assets/css/propertyCard.css';

const CategorySearch = () => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);

  const handleSearch = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/categories/search', {
        params: { query },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Categories:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Search Categories</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Mostrar las categorías como tarjetas */}
      <div className="property-card-container">
        {categories.length > 0 &&
          categories.map((category) => (
            <PropertyCard
              key={category.category_id}
              title={category.category_name}
              price={`Domain: ${category.domain_name}`}
              link={`https://www.mercadolibre.com.ar/c/${category.category_id}`}
              img="default.jpg" // Puedes reemplazar esto con una imagen predeterminada
              size="N/A" // No hay información de tamaño en la respuesta
              bedrooms="N/A" // No hay información de dormitorios en la respuesta
              bathrooms="N/A" // No hay información de baños en la respuesta
            />
          ))}
      </div>
    </div>
  );
};

export default CategorySearch;