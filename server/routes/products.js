import axios from 'axios';

export const getProducts = async (req, res) => {
  const { query, site } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extrae el token desde "Bearer <token>"

  if (!query || !site || !accessToken) {
    return res.status(400).json({ error: 'Faltan parámetros o token' });
  }

  try {
    const response = await axios.get(`https://api.mercadolibre.com/sites/${site}/search`, {
      params: { q: query },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
