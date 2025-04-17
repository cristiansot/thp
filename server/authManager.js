import axios from 'axios';

export const getValidAccessToken = async () => {
  const tokens = getTokens();

  if (!tokens) throw new Error('No tokens found');
  
  // Verificar si el token está vencido
  const now = Date.now();
  if (now < tokens.expires_at) {
    return tokens.access_token;
  }

  // Si venció, usar el refresh_token
  console.log('🔄 Access token vencido, refrescando...');
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
  const expires_at = Date.now() + expires_in * 1000;

  // Guardar nuevos tokens
  saveTokens({ access_token, refresh_token, user_id: tokens.user_id, expires_at });

  return access_token;
};
