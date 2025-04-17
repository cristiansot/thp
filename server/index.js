import express from 'express';
import axios from 'axios';
import fs from 'fs/promises'; // Importa fs/promises para leer el archivo
import dotenv from 'dotenv';
import { callback } from './oauth/callback.js';
import { getAccessToken } from './oauth/getAccessToken.js'; // Asegúrate de que esta función esté correctamente importada

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener el access_token (si ya está guardado)
app.get('/api/access_token', async (req, res) => {
  try {
    const tokenData = await fs.readFile('./oauth/tokens.json', 'utf8');
    const { refresh_token } = JSON.parse(tokenData);

    // Usamos el refresh_token para obtener un nuevo access_token de Mercado Libre
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        refresh_token,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    res.json({ access_token }); // Devuelve el access_token al frontend
  } catch (err) {
    console.error('Error al obtener el access_token:', err.message);
    res.status(500).send('Error al obtener el access_token');
  }
});

// Ruta de callback para Mercado Libre
app.get('/oauth/callback', callback);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
