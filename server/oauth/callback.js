import axios from 'axios';
import { saveTokens } from './tokenStorage.js';

export const callback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.log('❌ No se recibió código en el callback');
    return res.status(400).send('No code provided');
  }

  console.log('✅ Código recibido:', code.substring(0, 20) + '...');

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

    console.log('✅ Respuesta de ML:', {
      access_token: response.data.access_token ? '✅ Presente' : '❌ Faltante',
      refresh_token: response.data.refresh_token ? '✅ Presente' : '❌ Faltante',
      expires_in: response.data.expires_in,
      user_id: response.data.user_id
    });

    const { access_token, refresh_token, expires_in, user_id } = response.data;
    const expires_at = Date.now() + expires_in * 1000;

    saveTokens({ access_token, refresh_token, user_id, expires_at });

    // Mostrar página de éxito con tokens (solo para debug)
    res.send(`
      <html>
        <head><title>✅ Autorización Exitosa</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>✅ Autorización Exitosa</h1>
          <p>Tokens guardados correctamente en el servidor.</p>
          <p>Access Token: ${access_token.substring(0, 30)}...</p>
          <p>Refresh Token: ${refresh_token.substring(0, 30)}...</p>
          <p>Expira: ${new Date(expires_at).toLocaleString()}</p>
          <p>User ID: ${user_id}</p>
          <p><a href="/oauth/check">Verificar tokens guardados</a></p>
          <p><a href="/api/properties/detailed">Probar API de propiedades</a></p>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.error('❌ Error en callback OAuth:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    res.status(500).send(`
      <html>
        <head><title>❌ Error de Autorización</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>❌ Error de Autorización</h1>
          <p>Error: ${err.message}</p>
          <p>Detalles: ${JSON.stringify(err.response?.data || 'Sin detalles')}</p>
          <p><a href="/oauth/login">Intentar nuevamente</a></p>
        </body>
      </html>
    `);
  }
};