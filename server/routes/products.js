import axios from 'axios';

export const getProducts = async (req, res) => {
  try {
    // Obtén los parámetros de la consulta (query) desde la URL
    const { filters, page, sort } = req.query;

    // Realiza la solicitud a la API de Mercado Libre
    const response = await axios.get('https://api.mercadolibre.com/sites/MLC/search', {
      params: {
        filters: filters || '',  // Si no se pasa un filtro, se usa vacío
        page: page || 1,          // Si no se pasa una página, se usa la página 1
        sort: sort || 'DEFAULT',  // Si no se pasa orden, se usa el orden predeterminado
      },
    });

    // Responde con los datos obtenidos de la API
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data || error.message);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};
