import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.resolve('tokens.json');

export const getTokens = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) {
      console.warn('⚠️ No se encontró el archivo tokens.json');
      return null;
    }

    const data = fs.readFileSync(TOKEN_PATH, 'utf-8');
    if (!data) {
      console.warn('⚠️ El archivo tokens.json está vacío');
      return null;
    }

    const tokens = JSON.parse(data);
    console.log('Tokens leídos:', tokens);
    return tokens;
  } catch (err) {
    console.error('❌ Error al leer tokens:', err.message);
    return null;
  }
};

export const saveTokens = (tokens) => {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('✅ Tokens guardados correctamente:', tokens);
  } catch (err) {
    console.error('❌ Error al guardar tokens:', err.message);
  }
};
