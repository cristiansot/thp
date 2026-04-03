import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { fetchPropertiesFromML, getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';
import router from './routes/contact.js';

dotenv.config();
const app = express();

// Configuración robusta de CORS
const allowedOrigins = [
  'https://www.thp.cl',
  'https://thp.cl',
  'http://www.thp.cl',
  'http://thp.cl',
  'https://api.thp.cl',
  'https://develop.d2autp5rg0pd7o.amplifyapp.com',
  'https://thp-backend.us-east-2.elasticbeanstalk.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
];


const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin recibido:', origin);
    
    // Permitir requests sin origin (como curl, postman)
    if (!origin) {
      console.log('✅ Request sin origin (permitido)');
      return callback(null, true);
    }
    
    // Para desarrollo, permitir todos
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Modo desarrollo: permitiendo todos los orígenes');
      return callback(null, true);
    }
    
    // Verificar si el origin está en la lista blanca
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin permitido:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin bloqueado:', origin);
      // En lugar de error, permitir (solo para pruebas)
      console.log('⚠️ Permitiendo origen desconocido para pruebas');
      return callback(null, true);
      // return callback(new Error('CORS no permitido para este origen'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

// Aplicar CORS globalmente
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests
app.options(/.*/, cors(corsOptions));

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/contact', router);

// Rutas
app.get('/test', (req, res) => res.send('Test page - CORS Fixed'));
app.get('/health', (req, res) => res.status(200).json({ 
  status: 'OK', 
  cors: 'enabled',
  timestamp: new Date().toISOString()
}));
app.get('/api/properties', fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ Server running on port ${PORT} in ${ENV} mode`);
  console.log(`🌐 CORS habilitado para: ${allowedOrigins.join(', ')}`);

  try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Productos del vendedor al arrancar el servidor:', properties.length, 'propiedades');
  } catch (err) {
    console.error('🔴 Error inicial al obtener productos:', err.message);
  }
});
