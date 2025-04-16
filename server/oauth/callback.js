// server/oauth/callback.js
import axios from 'axios';

export async function callback(req, res) {
  const { code } = req.query;

  console.log('Received code:', code);  // Agregar para ver si se recibe el código

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  
    const { access_token, refresh_token, user_id, expires_in } = response.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('User ID:', user_id);
  
    res.send('Autenticación exitosa. Ya podés usar la API de Mercado Libre.');
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
  
}


