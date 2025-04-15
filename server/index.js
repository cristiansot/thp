import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { scrapeData } from './scraper.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

let cachedData = [];

const loadCachedData = () => {
  try {
    const data = fs.readFileSync('./scraping/cachedProperties.json', 'utf8');
    cachedData = JSON.parse(data);
  } catch (err) {
    console.error('No se pudo cargar cachedProperties.json:', err.message);
  }
};

// Al iniciar el servidor, cargar caché si existe
loadCachedData();

// Endpoint para el frontend
app.get('/api/properties', (req, res) => {
  res.json(cachedData);
});

// Actualizar scraping cada 1 hora
const scrapeAndCache = async () => {
  try {
    const data = await scrapeData();
    cachedData = data;
  } catch (err) {
    console.error('Scraping falló. Usando última caché.');
  }
};

scrapeAndCache(); // hacer scraping al inicio
setInterval(scrapeAndCache, 60 * 60 * 1000); // cada 1 hora

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
