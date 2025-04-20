import axios from 'axios';

const user_id = process.env.USER_ID;

export const fetchPropertiesFromML = async () => {
  const url = `https://api.mercadolibre.com/users/${user_id}/items/search`;
  console.log('URL generada:', url);

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });

  console.log('IDs obtenidos:', data.results);
  return data.results;
};

export const getProperties = async (req, res) => {
  try {
    const results = await fetchPropertiesFromML();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los productos',
      details: error.response?.data || error.message,
    });
  }
};
