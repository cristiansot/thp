import fs from 'fs';
import path from 'path';

export async function callback(req, res) {
  const { code } = req.query;

  if (!code) return res.status(400).send('No code received');

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    // Guardamos los tokens en un archivo
    const tokensPath = path.join(process.cwd(), 'server', 'tokens.json');
    fs.writeFileSync(tokensPath, JSON.stringify({
      access_token,
      refresh_token,
      user_id,
      expires_at: Date.now() + expires_in * 1000
    }, null, 2));

    console.log('🔐 Tokens guardados con éxito');
    res.send('Autenticación exitosa. Ya podés usar la API de Mercado Libre.');
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
}
