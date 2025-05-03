import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { sendEmail } from '../services/mail.js';

const URL = 'https://www.portalinmobiliario.com/MLC-2878097464-departamento-de-grandes-dimensiones-3d2b-_JM#position=22&search_layout=map&type=item&tracking_id=b315894e-3baf-4796-9ec8-0527bdb96e14';
const PRICE_SELECTOR = '.andes-money-amount__fraction';
const DIR_PATH = './server/scraping';
const FILE_PATH = path.join(DIR_PATH, 'previousPrice.json');

export async function checkPriceDrop() {
  try {
    console.log('🔄 Iniciando revisión de precio...');

    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const priceText = $(PRICE_SELECTOR).first().text().replace(/[^\d]/g, '');
    const currentPrice = parseInt(priceText, 10);

    console.log(`💰 Precio actual leído: ${currentPrice}`);

    // Crear carpeta si no existe
    if (!fs.existsSync(DIR_PATH)) {
      fs.mkdirSync(DIR_PATH, { recursive: true });
    }

    // Si el archivo no existe, guardar precio actual
    if (!fs.existsSync(FILE_PATH)) {
      console.log('📁 No hay precio previo. Guardando por primera vez...');
      fs.writeFileSync(FILE_PATH, JSON.stringify({ price: currentPrice }, null, 2));
      return;
    }

    // Leer precio anterior
    const previousData = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const previousPrice = previousData.price;

    console.log(`📦 Precio anterior: ${previousPrice}`);

    if (currentPrice < previousPrice) {
      console.log(`📉 El precio bajó de ${previousPrice} a ${currentPrice}`);

      await sendEmail({
        to: process.env.EMAIL_TO,
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
