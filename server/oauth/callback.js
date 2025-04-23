import axios from 'axios';
import { saveTokens } from './tokenStorage.js';


export const callback = async (req, res) => {
  const code = req.query.code;
  console.log('Received code:', code);

  if (!code) {
    return res.status(400).json({ error: 'Código no proporcionado' });
  }

  try {
    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.ML_CLIENT_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          code,
          redirect_uri: process.env.ML_REDIRECT_URI,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Token Response:', response.data);
    saveTokens(response.data); // <-- Aquí se guardan

    res.redirect('http://localhost:5173/'); // o a donde desees
  } catch (error) {
    console.error('Error en callback OAuth:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al intercambiar el código por tokens' });
  }
};

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

    // Devuelve los nuevos tokens
    return response.data;
  } catch (err) {
    console.error('Error refreshing token:', err.response?.data || err.message);
    throw new Error('Error al refrescar el token');
  }
};
