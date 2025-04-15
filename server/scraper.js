import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

const readPropertiesFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./scraping/properties.json', 'utf8', (err, data) => {
      if (err) reject('Error al leer properties.json: ' + err);
      else resolve(JSON.parse(data));
    });
  });
};

export const scrapeData = async () => {
  try {
    const { properties } = await readPropertiesFile();
    const results = [];

    for (let property of properties) {
      const { url, size, bedrooms, bathrooms, img } = property;

      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

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
        link: url,
      });

      await new Promise((res) => setTimeout(res, 500)); // delay opcional
    }

    // Guardar en caché
    fs.writeFileSync('./scraping/cachedProperties.json', JSON.stringify(results, null, 2));
    console.log('Datos de propiedades actualizados');
    return results;
  } catch (error) {
    console.error('Error durante scraping:', error);
    throw error;
  }
};
