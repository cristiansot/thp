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

// ⚡ Configurar Express detrás de Cloudflare
app.set('trust proxy', 1); // Cambia a 1 o true

// Middleware de CORS CORREGIDO
const corsOptions = {
  origin: [
    'https://develop.d2autp5rg0pd7o.amplifyapp.com',
    'https://thp-backend.us-east-2.elasticbeanstalk.com',
    'https://api.thp.cl',  // ← AGREGAR TU DOMINIO
    'https://thp.cl',      // ← SI TAMBIÉN LO USAS
    'http://localhost:3000', // Para desarrollo local
    'http://localhost:3001'  // Para desarrollo local
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/contact', router);

// 🚨 ELIMINAR O COMENTAR LOS MIDDLEWARE DE REDIRECCIÓN HTTPS
// CloudFlare ya maneja HTTPS, tu backend recibe HTTP
// app.use((req, res, next) => {
//   if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect(301, `https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

// Rutas
app.get('/test', (req, res) => res.send('Test page'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/api/properties', fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

// 🚨 ELIMINAR ESTE MIDDLEWARE TAMBIÉN
// app.use((req, res, next) => {
//   if (!req.secure) {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

// Inicialización del servidor
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, '0.0.0.0', async () => { // ← ESCUCHAR EN TODAS LAS INTERFACES
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);

  try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Productos del vendedor al arrancar el servidor:', properties);
  } catch (err) {
    console.error('🔴 Error inicial al obtener productos:', err.message);
  }
});