import axios from 'axios';

export const getProducts = async (req, res) => {
  const { query, site } = req.query; // 'query' es el término de búsqueda, 'site' es el país

  if (!query || !site) {
    return res.status(400).json({ error: 'Faltan parámetros: query y site' });
  }

  try {
    const response = await axios.get(`https://api.mercadolibre.com/sites/${site}/search`, {
      params: { q: query }
    });
    res.json(response.data);
    console.log('Productos obtenidos:', response.data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
