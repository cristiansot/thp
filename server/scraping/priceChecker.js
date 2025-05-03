import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { sendEmail } from '../services/mail.js';

const URL = 'https://www.portalinmobiliario.com/MLC-2885255660-casa-test-_JM';

const PRICE_SELECTOR = '.andes-money-amount__fraction';
const FILE_PATH = './server/scraping/previousPrice.json';

export async function checkPriceDrop() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);

    const priceText = $(PRICE_SELECTOR).first().text().replace(/[^\d]/g, '');
    const currentPrice = parseInt(priceText, 10);

    const previousData = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const previousPrice = previousData.price;

    if (currentPrice < previousPrice) {
      console.log(`📉 El precio bajó de ${previousPrice} a ${currentPrice}`);

      await sendEmail({
        to: 'tu-email@dominio.com',
        subject: '¡El precio del departamento bajó!',
        text: `El precio bajó de $${previousPrice.toLocaleString()} a $${currentPrice.toLocaleString()}\n\n${URL}`,
      });

      fs.writeFileSync(FILE_PATH, JSON.stringify({ price: currentPrice }, null, 2));
    } else {
      console.log(`🔍 Precio actual: $${currentPrice.toLocaleString()} (sin cambios)`);
    }
  } catch (err) {
    console.error('❌ Error al hacer scraping:', err.message);
  }
}
