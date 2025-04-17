import express from 'express';
import { searchCategories } from '../utils/categories.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const accessToken = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const categories = await searchCategories(query, accessToken);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;