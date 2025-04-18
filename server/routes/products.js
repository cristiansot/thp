import axios from 'axios';

export const getProducts = async (req, res) => {
  try {
    const {
      seller_id = 1628129303, // ID del vendedor
      site = 'MLC',           // Por defecto Chile
      page = 1,               // Página por defecto
      sort = 'DEFAULT',       // Orden por defecto
    } = req.query;

    console.log('Parámetros recibidos:', { seller_id, site, page, sort });

    if (!seller_id) {
      return res.status(400).json({ error: 'Falta el parámetro seller_id' });
    }

    // Verifica el token de acceso
    console.log('Access Token:', process.env.ACCESS_TOKEN);

    const url = `https://api.mercadolibre.com/sites/${site}/search`;
    console.log('URL generada:', url);

    const { data } = await axios.get(url, {
      params: { seller_id, offset: (page - 1) * 50, sort },
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Token de acceso
      },
    });

    console.log('Respuesta de la API de Mercado Libre:', data);

    res.status(200).json(data.results); // Solo enviamos los resultados
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los productos',
      details: error.response?.data || error.message,
    });
  }
};