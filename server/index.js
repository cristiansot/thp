import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { fetchPropertiesFromML } from './routes/properties.js';
import { getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:5173', 'https://thp-backend-16jj.onrender.com'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rutas
app.get('/test', (req, res) => res.send('Test page'));
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/api/properties',fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

// Error handlerg
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Algo salió mal.',
  });
});

const PORT = process.env.PORT || 10000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);

  try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Productos del vendedor al arrancar el servidor:', properties);
  } catch (err) {
    console.error('🔴 Error inicial al obtener productos:', err.message);
  }
});

const properties = await fetchPropertiesFromML();
console.log('🔹 Productos del vendedor al arrancar el servidor:', properties);
