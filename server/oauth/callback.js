import axios from 'axios';
import fs from 'fs/promises'; 
import dotenv from 'dotenv';
dotenv.config();

async function getAccessToken() {
  try {
    const tokenData = JSON.parse(await fs.readFile('./oauth/tokens.json', 'utf-8'));
    const { refresh_token } = tokenData;

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

    const { access_token, expires_in } = response.data;

    // Guardar el nuevo access_token en el archivo (actualiza el token)
    tokenData.access_token = access_token;
    await fs.writeFile('./oauth/tokens.json', JSON.stringify(tokenData, null, 2));
    console.log('✅ Nuevo access token guardado correctamente');
    
    return access_token;
  } catch (error) {
    console.error('Error al obtener o refrescar el access token:', error.response?.data || error.message);
    throw new Error('Error al obtener el access token');
  }
}

// Ruta para obtener datos del usuario de Mercado Libre usando el access token
export async function fetchUserData(req, res) {
  try {
    const accessToken = await getAccessToken(); // Obtén el access token (refrescado si es necesario)
    
    const response = await axios.get('https://api.mercadolibre.com/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    console.log('User Data:', response.data);
    res.json(response.data); // Retorna los datos al frontend
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error.message);
    res.status(500).send('Error al obtener los datos del usuario.');
  }
}
