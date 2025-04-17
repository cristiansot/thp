import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
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
    const accessToken = await getAccessToken(); // Usamos la función para obtener el access_token
    res.json({ access_token: accessToken }); // Devuelve el access_token al frontend
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
