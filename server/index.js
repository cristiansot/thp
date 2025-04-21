import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import axios from 'axios';
import { login } from './oauth/login.js';
import { callback, refreshToken } from './oauth/callback.js';
import { fetchPropertiesFromML, getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';
import { getTokens, saveTokens } from './oauth/tokenStorage.js';

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
app.get('/api/properties', fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

app.get('/api/auth/refresh', async (req, res) => {
  const tokens = getTokens();
  if (!tokens || !tokens.refresh_token) {
    return res.status(401).json({ error: 'No refresh token available' });
  }

  try {
    const newTokens = await refreshToken(tokens.refresh_token);
    saveTokens(newTokens);
    return res.json({ access_token: newTokens.access_token });
  } catch (error) {
    console.error('Error al refrescar token:', error.message);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Algo salió mal.',
  });
});

// Función para manejar el token al iniciar el servidor
const handleTokenAtStartup = async () => {
  const tokens = getTokens();
  const now = Date.now();

  if (!tokens) {
    console.log('❌ No token found. Inicia sesión manualmente visitando /oauth/login');
    return;
  }

  if (tokens.expires_at < now) {
    console.log('⚠️ Token expired, refreshing...');
    try {
      const newTokens = await refreshToken(tokens.refresh_token);
      saveTokens(newTokens);
      console.log('🔄 Token refrescado correctamente.');
    } catch (err) {
      console.error('❌ Error al refrescar el token:', err.message);
    }
  } else {
    console.log('✅ Token válido cargado desde almacenamiento.');
  }
};

// Inicia el servidor
const PORT = process.env.PORT || 10000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);
  await handleTokenAtStartup();

  try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Productos del vendedor al arrancar el servidor:', properties.length);
  } catch (err) {
    console.error('🔴 Error inicial al obtener productos:', err.message);
  }
});
