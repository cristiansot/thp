import express from 'express';
import cors from 'cors';
import { scrapeData } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Endpoint que hace scraping en vivo
app.get('/api/properties', async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (err) {
    console.error('Error durante scraping:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
