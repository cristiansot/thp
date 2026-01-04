import axios from 'axios';
import { saveTokens } from './tokenStorage.js';

export const callback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const { access_token, refresh_token, expires_in, user_id } = response.data;
    const expires_at = Date.now() + expires_in * 1000;

    saveTokens({ access_token, refresh_token, user_id, expires_at });

    res.redirect('/login-success');
  } catch (err) {
    console.error('❌ Error en callback OAuth:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al intercambiar el código por tokens' });
  }
};
