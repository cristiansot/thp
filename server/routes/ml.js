import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/items', async (req, res) => {
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  const userId = req.query.user_id;

  if (!accessToken || !userId) {
    return res.status(400).json({ error: 'Falta access_token o user_id' });
  }

  try {
    const response = await axios.get(`https://api.mercadolibre.com/users/${userId}/items/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const itemIds = response.data.results;

    // Obtener detalle de los primeros 10 ítems (puedes ajustar esto)
    const itemsDetails = await Promise.all(
      itemIds.slice(0, 10).map(id =>
        axios.get(`https://api.mercadolibre.com/items/${id}`)
          .then(res => res.data)
      )
    );

    res.json(itemsDetails);
  } catch (err) {
    console.error('🔴 Error al obtener items:', err.message);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

export default router;
