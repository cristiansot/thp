import axios from 'axios';


export const getProducts = async (req, res) => {
  try {
    // Sacamos los parámetros de la URL: q (query), site, page y sort
    const {
      q,                // término de búsqueda obligatorio
      site = 'MLC',     // por defecto Chile
      page = 1,         // página por defecto
      sort = 'DEFAULT', // orden por defecto
    } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Falta el parámetro q (término de búsqueda)' });
    }

    // Construimos la URL dinámica según el site
    const url = `https://api.mercadolibre.com/sites/${site}/search`;

    // Llamada a Mercado Libre
    const { data } = await axios.get(url, {
      params: { q, page, sort },
    });

    // Devolvemos toda la respuesta de búsqueda
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};