import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { fetchPropertiesFromML, getDetailedProperties } from './routes/properties.js';
import { checkTokens } from './routes/auth.js';
import contactRouter from './routes/contact.js';

dotenv.config();
const app = express();

// ===============================
// 🌐 CORS
// ===============================
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

    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Dev mode: permitiendo todos');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin permitido:', origin);
      return callback(null, true);
    }

    console.log('❌ Origin bloqueado:', origin);
    return callback(new Error('CORS no permitido'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// ===============================
// 🛡️ SEGURIDAD + PARSERS
// ===============================
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// 📩 CONTACT (PROTEGIDO)
// ===============================
app.use('/api/contact', contactRouter);

// ===============================
// 🔧 RUTAS
// ===============================
app.get('/test', (req, res) => res.send('Test OK'));
app.get('/health', (req, res) =>
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
);

app.get('/api/properties', fetchPropertiesFromML);
app.get('/api/properties/detailed', getDetailedProperties);
app.get('/oauth/login', login);
app.get('/oauth/callback', callback);
app.get('/oauth/check', checkTokens);

// ===============================
// 🚀 SERVER
// ===============================
const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`✅ Server running on port ${PORT} (${ENV})`);

  try {
    const properties = await fetchPropertiesFromML();
    console.log('🔹 Props cargadas:', properties.length);
  } catch (err) {
    console.error('🔴 Error inicial:', err.message);
  }
});