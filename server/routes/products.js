import { getTokens } from '../oauth/tokenStorage.js';

export const getProducts = async (req, res) => {
  try {
    const tokens = getTokens();
    if (!tokens || !tokens.access_token) {
      return res.status(401).json({ error: 'No se encontró un token de acceso válido' });
    }

    const accessToken = tokens.access_token;

    const { seller_id = 1628129303, site = 'MLC', page = 1, sort = 'DEFAULT' } = req.query;

    const url = `https://api.mercadolibre.com/sites/${site}/search`;
    const { data } = await axios.get(url, {
      params: { seller_id, offset: (page - 1) * 50, sort },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(200).json(data.results);
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los productos',
      details: error.response?.data || error.message,
    });
  }
};