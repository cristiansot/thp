import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { getProducts } from './routes/products.js'; 

dotenv.config();
const app = express();

// Middleware para seguridad con Helmet
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', process.env.FRONTEND_URL],
  credentials: true,
};
app.use(cors(corsOptions));

// Advertencia si FRONTEND_URL no está definido
if (!process.env.FRONTEND_URL) {
  console.warn('⚠️ FRONTEND_URL no está definido en el archivo .env');
}

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Test page');
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API: Obtener productos
app.get('/api/products', getProducts);  // Usamos el endpoint aquí

// Rutas OAuth
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Algo salió mal. Por favor, inténtelo de nuevo más tarde.',
  });
});

const PORT = process.env.PORT || 10000;
const ENV = process.env.NODE_ENV || 'development';
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);
});
