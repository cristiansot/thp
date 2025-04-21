import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.resolve('tokens.json');

export const getTokens = () => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) return null;

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
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('✅ Tokens guardados correctamente.');
  } catch (err) {
    console.error('❌ Error al guardar tokens:', err.message);
  }
};
