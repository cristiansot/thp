import axios from 'axios';
import { getValidAccessToken } from '../services/authManager.js';
import { getTokens } from '../oauth/tokenStorage.js';
import { sendEmailNotification } from '../services/mail.js';
import { loadPreviousStatuses, saveCurrentStatuses } from '../services/propertyStatusStore.js';
 // Asegúrate que la ruta sea correcta

// Esta función obtiene los IDs de las propiedades del usuario.
export const fetchPropertiesFromML = async () => {
  const { access_token } = getTokens(); // Obtener el access_token guardado en memoria

  if (!access_token) {
    throw new Error('No se encontró un token de acceso válido');
  }

  const user_id = process.env.USER_ID;
  const url = `https://api.mercadolibre.com/users/${user_id}/items/search`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const ids = data.results;
    console.log('✅ IDs obtenidos de ML:', ids);

    return ids;
  } catch (error) {
    console.error('Error al obtener las propiedades:', error.response?.data || error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

// Esta función obtiene los detalles de cada propiedad usando los IDs
export const detailProperties = async () => {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error('No hay tokens disponibles. Realiza el login.');

  const ids = await fetchPropertiesFromML();
  if (!ids || ids.length === 0) {
    console.log('⚠️ No se encontraron propiedades para el usuario.');
    return [];
  }

  const previousStatuses = loadPreviousStatuses();
  const properties = [];

  for (const id of ids) {
    const url = `https://api.mercadolibre.com/items/${id}`;
    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

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
        operation: extractAttr('OPERATION'),
        domain_id: data.domain_id,
      };

      // Comparar estado actual vs anterior
      const prevStatus = previousStatuses[id];
      if (prevStatus && prevStatus !== property.status) {
        console.log(`🔔 Cambio de estado detectado para ${id}: ${prevStatus} → ${property.status}`);
        sendEmailNotification(property);
      }

      properties.push(property);
    } catch (error) {
      console.error(`Error al obtener detalles de la propiedad ${id}:`, error.response?.data || error.message);
    }
  }

  // Guardar los nuevos estados
  saveCurrentStatuses(properties);

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
