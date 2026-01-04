import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getValidAccessToken } from '../services/authManager.js';
import { getTokens } from '../oauth/tokenStorage.js';
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
      sendEmailNotification(property);
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

// 🔍 Obtener IDs de propiedades del vendedor
export const fetchPropertiesFromML = async () => {
  const { access_token } = getTokens();
  if (!access_token) throw new Error('No se encontró un token de acceso válido');

  const user_id = process.env.USER_ID;
  const url = `https://api.mercadolibre.com/users/${user_id}/items/search`;

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return data.results;
  } catch (error) {
    console.error('Error al obtener las propiedades:', error.response?.data || error.message);
    throw new Error('No se pudieron obtener las propiedades');
  }
};

// 🧠 Obtener detalles de propiedades sin filtrar
export const detailProperties = async () => {
  const accessToken = await getValidAccessToken();
  const ids = await fetchPropertiesFromML();
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

      properties.push({
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
        date_created: data.date_created || null,
        last_updated: data.last_updated || null,
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
      error: error.message || 'No se pudieron obtener los detalles de las propiedades',
    });
  }
};