import axios from 'axios';

export const fetchPropertiesFromML = async () => {
  const url = `https://api.mercadolibre.com/users/1628129303/items/search`;
  console.log('URL generada:', url);

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer APP_USR-7387383393785692-042011-1e83b1c817e9d3bf59cec17451410717-1628129303`,
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
