import express from 'express';
import cors from 'cors';
import { scrapeData } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Caché en memoria
let cachedData = null;
let lastScrapeTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

app.get('/api/properties', async (req, res) => {
  const now = Date.now();

  if (!cachedData || now - lastScrapeTime > CACHE_DURATION) {
    try {
      console.log('Scrapeando datos...');
      cachedData = await scrapeData();
      lastScrapeTime = now;
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
  } else {
    console.log('Usando datos cacheados');
  }

  res.json(cachedData);
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
