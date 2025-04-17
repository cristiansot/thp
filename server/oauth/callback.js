import axios from 'axios';
import { saveTokens } from './tokenStorage';

export async function callback(req, res) {
  const { code } = req.query;

  console.log('Received code:', code);  // Verifica que el código esté llegando correctamente

  if (!code) {
    return res.status(400).send('No code received');
  }

  try {
    // Intercambia el código por el token
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    });

    console.log('Token Response:', response.data);

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    // Aquí puedes almacenar el refresh_token en tu base de datos si es necesario
    const expires_at = Date.now() + expires_in * 1000;

    saveTokens({ access_token, refresh_token, user_id, expires_at });

    res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}`);
    res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}`);
    
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
}

// Función para refrescar el token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('New Token:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error refreshing token:', err.response?.data || err.message);
  }
};