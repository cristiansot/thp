import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { fetchPropertiesFromML, getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';
import cron from 'node-cron';
import router from './routes/contact.js'; 

dotenv.config();
const app = express();

// ⚡ Configurar Express detrás de un proxy (Nginx/Cloudflare)
app.set('trust proxy', true);

// Middleware para HTTPS correcto con Cloudflare Flexible
app.use((req, res, next) => {
  if (!req.secure) {
    // Redirige usando el host real que Nginx/Cloudflare pasa
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Middlewares
const corsOptions = {
  origin: [
    'https://develop.d2autp5rg0pd7o.amplifyapp.com',
    'https://thp-backend.us-east-2.elasticbeanstalk.com'
  ],
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

// Cron job comentado (puedes activarlo cuando quieras)
// cron.schedule('* */6 * * *', () => {
//   console.log('⏱️ Chequeando precio...');
//   checkPriceDrop();
// });

app.use((req, res, next) => {
  if (!req.secure) { // verifica si la petición es segura
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
// Inicialización del servidor
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);

  // try {
  //   console.log('⏳ Ejecutando scraping para monitorear el precio...');
  //   await checkPriceDrop();
  //   console.log('✅ Scraping inicial completo.');
  // } catch (err) {
  //   console.error('❌ Error al ejecutar scraping inicial:', err.message);
  // }

   try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Productos del vendedor al arrancar el servidor:', properties);
  } catch (err) {
    console.error('🔴 Error inicial al obtener productos:', err.message);
  }
});