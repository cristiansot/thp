import axios from 'axios';

export async function callback(req, res) {
  const { code } = req.query;

  console.log('Received code:', code);  // Verifica que el código esté llegando correctamente

  if (!code) {
    return res.status(400).send('No code received');
  }

  try {
    // Intercambia el código por el token
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    });

    console.log('Token Response:', response.data); // Verifica que la respuesta contiene el token

    const { access_token, refresh_token, user_id, expires_in } = response.data;
    

    // Aquí puedes hacer lo que necesitaes con el token: almacenarlo, enviarlo al frontend, etc.
    
    // Redirige al frontend con el token o muestra un mensaje
    res.send('Autenticación exitosa. Ya podés usar la API de Mercado Libre.');
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).send('Error en la autenticación.');
  }
}
