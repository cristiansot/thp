import axios from 'axios';
import fs from 'fs/promises'; // ⬅️ Para guardar el token
import dotenv from 'dotenv';
dotenv.config();

export async function callback(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code received');
  }

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
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    // 🔐 Guardamos el refresh_token en un archivo
    const tokenData = {
      refresh_token,
      saved_at: new Date().toISOString()
    };

    await fs.writeFile('./server/oauth/tokens.json', JSON.stringify(tokenData, null, 2));
    console.log('✅ Refresh token guardado correctamente');

    // Redirecciona al frontend (opcional)
    res.redirect(`${process.env.FRONTEND_URL}?access_token=${access_token}`);
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
}
