import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';

dotenv.config();
const app = express();

// Middleware para seguridad con Helmet (usalo solo si está instalado)
try {
  app.use(helmet());
} catch (error) {
  console.warn('⚠️ Helmet no está instalado. Ejecutá: npm install helmet');
}

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:5173/',         // Frontend local
    process.env.FRONTEND_URL        // URL del frontend en producción
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Test page');
});

// Rutas OAuth
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err);
  res.status(500).json({ error: 'Algo salió mal. Por favor, inténtelo de nuevo más tarde.' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
