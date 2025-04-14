import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Leer el archivo properties.json
const readPropertiesFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./properties.json', 'utf8', (err, data) => {
      if (err) {
        reject('Error para leer properties.json: ' + err);
      } else {
        resolve(JSON.parse(data)); // Parseamos el archivo JSON
      }
    });
  });
};

// Hacer scraping de cada propiedad usando las URLs
export const scrapeData = async () => {
  try {
    const { properties } = await readPropertiesFile();
    console.log('Propiedades a scrapear:', properties); // Verifica que se estén leyendo correctamente

    const results = [];
    
    for (let property of properties) {
      const { url, size, bedrooms, bathrooms, img } = property;

      console.log(`Scraping la URL: ${url}`); // Verifica cada URL
      const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

      const $ = cheerio.load(data);

      const title = $('h1.ui-pdp-title').text().trim();
      const price = $('.andes-money-amount').first().text().trim();
      const location = $('.ui-pdp-location').text().trim();

      results.push({
        title, 
        price, 
        location, 
        size, 
        bedrooms, 
        bathrooms, 
        img, 
        link: url 
      });
    }

    console.log('Datos obtenidos del scraping:', results); // Verifica los resultados finales
    return results;
  } catch (error) {
    console.error('Error durante el scraping:', error); // Detalle del error
    throw error; // Re-lanza el error para que el servidor lo maneje
  }
};