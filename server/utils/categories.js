import axios from 'axios';

export const searchCategories = async (query, accessToken) => {
  try {
    const siteId = 'MLA'; // Cambia esto si necesitas otro sitio (MLB, MLC, etc.)
    const limit = 3; // Puedes ajustar el límite según tus necesidades

    const response = await axios.get(`https://api.mercadolibre.com/sites/${siteId}/domain_discovery/search`, {
      params: {
        q: query,
        limit,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Categories Response:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching categories:', err.response?.data || err.message);
    throw err;
  }
};