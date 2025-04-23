import axios from 'axios';
import { getTokens, saveTokens } from '../oauth/tokenStorage.js';

export const getValidAccessToken = async () => {
  const tokens = getTokens();

  if (!tokens || !tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
    console.warn('⚠️ Tokens incompletos o no encontrados. Retornando null.');
    return null;
  }

  // Verificar si el token está vigente
  const now = Date.now();
  if (now() >= tokens.expires_at) {
    await refreshAccessToken(tokens.refresh_token)
  }

  // Token expirado, intentar refresh
  console.log('🔄 Access token vencido, intentando refrescar...');
  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        refresh_token: tokens.refresh_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expires_at = Date.now() + tokenData.expires_in * 1000;

    // Guardar los nuevos tokens
    saveTokens({
      access_token,
      refresh_token: refresh_token || tokens.refresh_token,
      user_id: tokens.user_id,
      expires_at,
    });

    console.log('✅ Token refrescado y guardado correctamente');
    return access_token;
  } catch (err) {
    console.error('❌ Error al refrescar token:', err.response?.data || err.message);
    return null;
  }
};
