import axios from 'axios';
import { getValidAccessToken } from '../services/authManager.js';

// Esta función obtiene los IDs de las propiedades del usuario.
export const fetchPropertiesFromML = async () => {
  const user_id = process.env.USER_ID;
  const url = `https://api.mercadolibre.com/users/${user_id}/items/search`;
  console.log('URL generada para obtener propiedades:', url);
  
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    // Solo devuelve los IDs de las propiedades
    const ids = data.results; // Array con los IDs de las propiedades
    console.log('IDs obtenidos:', ids);
    return ids;
  } catch (error) {
    console.error('Error al obtener las propiedades:', error.response?.data || error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

// Esta función obtiene los detalles de cada propiedad usando los IDs
export const detailProperties = async () => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No hay tokens disponibles. Realiza el login.');
  }

  const ids = await fetchPropertiesFromML();
  console.log('IDs de propiedades para obtener detalles:', ids);

  const properties = [];

  for (const id of ids) {
    const url = `https://api.mercadolibre.com/items/${id}`;
    console.log('Consultando detalles para:', url);

    try {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (data.status !== 'active') {
        console.log(`Propiedad ${id} ignorada por no estar activa (estado: ${data.status})`);
        continue;
      }

      const { title, price, pictures, attributes, permalink, video_id } = data;

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
        status: data.status,
        permalink,
        video_id,
        offices: extractAttr('OFFICES'),
        total_area: extractAttr('TOTAL_AREA'),
        latitude: data.geolocation?.latitude || null, 
        longitude: data.geolocation?.longitude || null,
      };

      console.log(`Detalles de la propiedad activa ${id}:`, property);
      properties.push(property);
    } catch (error) {
      console.error(`Error al obtener detalles de la propiedad ${id}:`, error.response?.data || error.message);
    }
  }

  return properties;
};

// Endpoint para obtener las propiedades detalladas
export const getDetailedProperties = async (req, res) => {
  try {
    const detailed = await detailProperties();
    res.status(200).json(detailed);
  } catch (error) {
    console.error('Error al obtener propiedades detalladas:', error.message);
    res.status(500).json({
      error: error.message || 'No se pudieron obtener los detalles de las propiedades',
    });
  }
};
