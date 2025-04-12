import express from 'express';
import cors from 'cors';  // Importa cors
import { scrapeData } from './scraper.js'; 

const app = express();
const PORT = 3001;

// Habilita CORS para todas las solicitudes
app.use(cors());

app.get('/api/properties', async (req, res) => {
  try {
    const scrapedData = await scrapeData();  // Llama a scrapeData
    res.json(scrapedData); // Responde con los datos del scraping
  } catch (error) {
    console.error('Error al obtener propiedades:', error); // Verifica el error
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
