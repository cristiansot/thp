import axios from 'axios';
import { fetchPropertiesFromML } from './properties.js';

export const detailProperties = async () => {
  const accessToken = process.env.ACCESS_TOKEN;

  const ids = await fetchPropertiesFromML(); // obtenemos los IDs

  const properties = [];

  for (const id of ids) {
    const url = `https://api.mercadolibre.com/items/${id}`;
    console.log('Consultando detalle:', url);

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { title, price, pictures, attributes } = data;

      const extractAttr = (attrId) =>
        attributes.find((attr) => attr.id === attrId)?.value_name || null;

      const property = {
        id,
        title,
        price,
        image: pictures?.[0]?.url || null,
        bedrooms: extractAttr('BEDROOMS'),
        bathrooms: extractAttr('FULL_BATHROOMS'),
        area: extractAttr('COVERED_AREA'),
      };

      properties.push(property);
    } catch (error) {
      console.error(`Error en detalle ${id}:`, error.response?.data || error.message);
    }
  }

  return properties;
};

export const getDetailedProperties = async (req, res) => {
  try {
    const detailed = await detailProperties();
    res.status(200).json(detailed);
  } catch (error) {
    console.error('Error al obtener propiedades detalladas:', error.response?.data || error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los detalles',
      details: error.response?.data || error.message,
    });
  }
};
