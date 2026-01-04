import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensPath = path.join(__dirname, 'tokens.json');

export const getTokens = () => {
  try {
    if (!fs.existsSync(tokensPath)) return null;

    const data = fs.readFileSync(tokensPath, 'utf-8');
    if (!data.trim()) return null;

    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error al leer tokens.json:', err.message);
    return null;
  }
};

export const saveTokens = (tokens) => {
  try {
    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
      console.error('❌ Tokens inválidos:', tokens);
      return;
    }
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
    console.log('✅ Tokens guardados correctamente');
  } catch (err) {
    console.error('❌ Error al guardar tokens:', err.message);
  }
};
