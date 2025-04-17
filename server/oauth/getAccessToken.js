import axios from 'axios';
import fs from 'fs/promises'; // Asegúrate de importar fs/promises

export async function getAccessToken() {
  try {
    // Leemos el archivo de tokens para obtener el refresh_token
    const tokenData = await fs.readFile('./oauth/tokens.json', 'utf8');
    const { refresh_token } = JSON.parse(tokenData);

    // Usamos el refresh_token para obtener un nuevo access_token de Mercado Libre
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        refresh_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Extraemos el access_token
    const { access_token } = response.data;
    return access_token; // Retornamos el access_token
  } catch (err) {
    console.error('Error al obtener el access_token usando refresh_token:', err.message);
    throw new Error('No se pudo obtener el access_token');
  }
}
