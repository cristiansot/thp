import axios from 'axios';
import { getTokens } from '../oauth/tokenStorage.js';

const seller_id = 1628129303;

const getProperties = async (req, res) => {
  try {
    if (!seller_id) {
      return res.status(400).json({ error: 'Falta el parámetro seller_id' });
    }

    const url = `https://api.mercadolibre.com/users/${seller_id}/items/search`;
    console.log('URL generada:', url);

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Token de acceso
      },
    });

    console.log('IDs obtenidos:', data.results);

    res.status(200).json(data.results);
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los productos',
      details: error.response?.data || error.message,
    });
  }
};

export default { getProperties };
