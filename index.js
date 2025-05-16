// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { fetchPropertiesFromML, getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';
import cron from 'node-cron';
import { checkPriceDrop } from './scraping/priceChecker.js';
import router from './routes/contact.js'; 

dotenv.config();
const app = express();

cron.schedule('0 0 0 * * *', () => {
  console.log('⏱️ Chequeando precio una vez al día a la medianoche...');
  checkPriceDrop();
});

// Middlewares
const corsOptions = {
  origin: ['https://develop.d1fsc0w13cfzr1.amplifyapp.com', 'https://3.14.158.64/, http://3.14.158.64/, https://3.14.158.64:8443/'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/contact', router);

// Rutas
app.get('/test', (req, res) => res.send('Test page'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/api/properties', fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

// Error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Algo salió mal.',
  });
});

const PORT = process.env.PORT || 10000;
// const ENV = process.env.NODE_ENV || 'development';
const ENV = process.env.NODE_ENV || 'production';


app.listen(PORT, () => {
  console.log(`✅ Servidor HTTP corriendo en el puerto ${PORT}`);

  // Para llamar funciones async en el callback, usa una función aparte:
  (async () => {
    try {
      console.log('⏳ Ejecutando scraping para monitorear el precio...');
      await checkPriceDrop();
      console.log('✅ Scraping inicial completo.');
    } catch (err) {
      console.error('❌ Error al ejecutar scraping inicial:', err.message);
    }

    try {
      const properties = await fetchPropertiesFromML();
      console.log('🔹 Productos del vendedor al arrancar el servidor:', properties);
    } catch (err) {
      console.error('🔴 Error inicial al obtener productos:', err.message);
    }
  })();
});