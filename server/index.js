import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { login } from './oauth/login.js';
import { callback } from './oauth/callback.js';
import { getProducts } from './routes/products.js';

dotenv.config();
const app = express();

app.get('/oauth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'No se recibió el código de autorización' });
  }

  console.log('Código recibido:', code);

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    console.log('Token recibido:', response.data);

    const { access_token, refresh_token, user_id } = response.data;
    // Puedes guardar el access_token en tu base de datos o en donde sea necesario
    res.redirect(`http://localhost:5173/?access_token=${access_token}`);
  } catch (err) {
    console.error('Error al obtener el token:', err.response?.data || err.message);
    res.status(500).json({ error: 'Error al intercambiar el código por el token' });
  }
});


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

//API
app.get('/api/products', getProducts);


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