import fs from 'fs';
import path from 'path';

// Asegúrate de que la ruta sea relativa a donde se ejecuta Node.js (root del proyecto)
const TOKEN_PATH = path.resolve('./oauth/tokens.json');

export const getTokens = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) {
      console.warn('⚠️ No se encontró el archivo tokens.json');
      return null;
    }

    const data = fs.readFileSync(TOKEN_PATH, 'utf-8');
    if (!data) return null;

    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error al leer tokens:', err.message);
    return null;
  }
};

export const saveTokens = (tokens) => {
  try {
    // Nos aseguramos que la carpeta `oauth` exista
    const dirPath = path.dirname(TOKEN_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
    console.log('✅ Tokens guardados correctamente en oauth/tokens.json');
  } catch (err) {
    console.error('❌ Error al guardar tokens:', err.message);
  }
};
