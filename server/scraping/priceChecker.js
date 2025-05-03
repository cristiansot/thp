import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { sendEmail } from '../services/mail.js';

const URL = 'https://www.portalinmobiliario.com/MLC-2885255660-casa-test-_JM';
const PRICE_SELECTOR = '.andes-money-amount__fraction';
const FILE_PATH = './server/scraping/previousPrice.json';

export async function checkPriceDrop() {
  try {
    console.log('🔄 Iniciando revisión de precio...');

    // Obtener HTML de la página
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    // Extraer y limpiar precio
    const priceText = $(PRICE_SELECTOR).first().text().replace(/[^\d]/g, '');
    const currentPrice = parseInt(priceText, 10);

    console.log(`💰 Precio actual leído: ${currentPrice}`);

    // Si no existe el archivo, lo creamos y salimos
    if (!fs.existsSync(FILE_PATH)) {
      console.log('📁 No hay precio previo. Guardando por primera vez...');
      fs.writeFileSync(FILE_PATH, JSON.stringify({ price: currentPrice }, null, 2));
      console.log('✅ Scraping inicial completo.');
      return;
    }

    // Leer precio anterior
    const previousData = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const previousPrice = previousData.price;

    console.log(`📦 Precio anterior: ${previousPrice}`);

    // Comparar precios
    if (currentPrice < previousPrice) {
      console.log(`📉 El precio bajó de ${previousPrice} a ${currentPrice}`);

      await sendEmail({
        to: process.env.EMAIL_TO, // Asegúrate de tener EMAIL_TO en tu .env
        subject: '¡El precio del inmueble bajó!',
        text: `El precio bajó de $${previousPrice.toLocaleString()} a $${currentPrice.toLocaleString()}\n\n${URL}`,
      });

      fs.writeFileSync(FILE_PATH, JSON.stringify({ price: currentPrice }, null, 2));
    } else {
      console.log(`🔍 Precio sin cambios o superior. Actual: $${currentPrice.toLocaleString()}`);
    }
  } catch (err) {
    console.error('❌ Error en priceChecker:', err.message);
  }
}
