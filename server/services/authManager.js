import axios from 'axios';
import { getTokens, saveTokens } from '../oauth/tokenStorage.js';

export const getValidAccessToken = async () => {
  const tokens = getTokens();

  if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
    console.warn('⚠️ Tokens incompletos o no encontrados');
    return null;
  }

  const now = Date.now();
  if (now >= tokens.expires_at) {
    console.log('🔄 Access token vencido, intentando refrescar...');
    return await refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'refresh_token',
          client_id: process.env.ML_CLIENT_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          refresh_token: refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in, user_id } = response.data;
    const expires_at = Date.now() + expires_in * 1000;

    saveTokens({
      access_token,
      refresh_token: refresh_token || refreshToken,
      user_id,
      expires_at,
    });

    console.log('✅ Token refrescado y guardado correctamente');
    return access_token;
  } catch (err) {
    console.error('❌ Error al refrescar token:', err.response?.data || err.message);
    return null;
  }
};
