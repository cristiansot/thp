export async function callback(req, res) {
  const { code } = req.query;
  console.log('Received code:', code);  // Verifica si el código llega correctamente  
  
  if (!code) {
    return res.status(400).send('No code received from Mercado Libre.');
  }

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
  
    console.log('Token Response:', response.data);  // Verificar la respuesta del token
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
}  
