import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getValidAccessToken } from '../services/authManager.js';
import { sendEmailNotification } from '../services/mail.js';

const STATUS_FILE_PATH = path.resolve('./data/propertyStatus.json');

// 🚨 Compara estado actual con el anterior y envía notificación si cambió
const detectStatusChanges = async (currentProperties) => {
  let previousStatus = {};

  // Leer archivo (o crear si no existe)
  try {
    if (fs.existsSync(STATUS_FILE_PATH)) {
      const raw = fs.readFileSync(STATUS_FILE_PATH, 'utf-8');
      previousStatus = JSON.parse(raw);
    } else {
      fs.writeFileSync(STATUS_FILE_PATH, '{}');
    }
  } catch (err) {
    console.error('Error al leer/crear archivo de estados:', err.message);
    return;
  }

  for (const property of currentProperties) {
    const prev = previousStatus[property.id];
    if (prev && prev !== property.status) {
      console.log(`🔔 Estado cambiado para ${property.title}: ${prev} → ${property.status}`);
      try {
        await sendEmailNotification(property);
      } catch (err) {
        console.error('Error enviando email:', err.message);
      }
    }
    previousStatus[property.id] = property.status; // actualizar el estado
  }

  // Guardar estado actualizado
  try {
    fs.writeFileSync(STATUS_FILE_PATH, JSON.stringify(previousStatus, null, 2));
  } catch (err) {
    console.error('Error al escribir archivo de estados:', err.message);
  }
};

// 🔍 Obtener IDs de propiedades del vendedor de manera segura
export const fetchPropertiesFromML = async (accessToken) => {
  if (!accessToken) {
    console.warn('⚠️ No hay access_token válido, se omite fetch de propiedades');
    return [];
  }

  const user_id = process.env.USER_ID;
  const url = `https://api.mercadolibre.com/users/${user_id}/items/search`;

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.results || [];
  } catch (error) {
    console.error('Error al obtener las propiedades:', error.response?.data || error.message);
    return [];
  }
};

// 🧠 Obtener detalles de propiedades de forma segura
export const detailProperties = async () => {
  const accessToken = await getValidAccessToken();

  // ⚠️ Protección: si no hay token, retornamos array vacío
  if (!accessToken) {
    console.warn('⚠️ No hay token válido, detailProperties retorna vacío');
    return [];
  }

  const ids = await fetchPropertiesFromML(accessToken);
  const properties = [];

  for (const id of ids) {
    const url = `https://api.mercadolibre.com/items/${id}`;

    try {
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { title, price, pictures, attributes, permalink, video_id, geolocation, status, domain_id, date_created, last_updated } = data;

      const extractAttr = (attrId) =>
        attributes?.find((attr) => attr.id === attrId)?.value_name || null;

      properties.push({
        id,
        title,
        price,
        image: pictures?.[0]?.url || null,
        bedrooms: extractAttr('BEDROOMS'),
        bathrooms: extractAttr('FULL_BATHROOMS'),
        area: extractAttr('COVERED_AREA'),
        status,
        permalink,
        video_id,
        offices: extractAttr('OFFICES'),
        total_area: extractAttr('TOTAL_AREA'),
        latitude: geolocation?.latitude || null,
        longitude: geolocation?.longitude || null,
        operation: extractAttr('OPERATION'),
        domain_id,
        date_created: date_created || null,
        last_updated: last_updated || null,
      });
    } catch (error) {
      console.error(`Error al obtener detalles de ${id}:`, error.response?.data || error.message);
    }
  }

  return properties;
};

// 📦 Endpoint que retorna solo propiedades activas
export const getDetailedProperties = async (req, res) => {
  try {
    const allProperties = await detailProperties();

    // ✅ ORDENAR POR FECHA DE PUBLICACIÓN (más nuevo primero)
    allProperties.sort(
      (a, b) => new Date(b.date_created) - new Date(a.date_created)
    );

    // Detectar cambios de estado y notificar
    await detectStatusChanges(allProperties);

    // Enviar solo propiedades activas al frontend
    const activeProperties = allProperties.filter((p) => p.status === 'active');

    res.status(200).json(activeProperties);
  } catch (error) {
    console.error('Error al obtener propiedades detalladas:', error.message);
    res.status(500).json({
      error: 'No se pudieron obtener los detalles de las propiedades',
    });
  }
};
