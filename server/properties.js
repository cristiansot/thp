import express from 'express';
import axios from 'axios';
import { getValidAccessToken } from '../services/authManager.js';

const router = express.Router();

router.get('/properties', async (req, res) => {
  try {
    const accessToken = await getValidAccessToken();

    const response = await axios.get('https://api.mercadolibre.com/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Error al obtener propiedades:', err.message);
    res.status(500).json({ error: 'No se pudo obtener información del usuario.' });
  }
});

export default router;
