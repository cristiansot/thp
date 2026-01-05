import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensPath = path.join(__dirname, 'tokens.json');

console.log('📁 Ruta de tokens.json:', tokensPath);
console.log('📁 Existe tokens.json?:', fs.existsSync(tokensPath));

export const getTokens = () => {
  try {
    if (!fs.existsSync(tokensPath)) {
      console.log('⚠️  tokens.json no existe');
      return null;
    }

    const data = fs.readFileSync(tokensPath, 'utf-8');
    console.log('📖 Contenido de tokens.json:', data.substring(0, 100) + '...');
    
    if (!data.trim()) {
      console.log('⚠️  tokens.json está vacío');
      return null;
    }

    const tokens = JSON.parse(data);
    console.log('✅ Tokens parseados:', {
      access_token: tokens.access_token ? '✅ Presente' : '❌ Faltante',
      refresh_token: tokens.refresh_token ? '✅ Presente' : '❌ Faltante',
      expires_at: tokens.expires_at ? new Date(tokens.expires_at).toLocaleString() : '❌ Faltante'
    });
    
    return tokens;
  } catch (err) {
    console.error('❌ Error al leer tokens.json:', err.message);
    return null;
  }
};

export const saveTokens = (tokens) => {
  try {
    console.log('💾 Intentando guardar tokens:', {
      access_token: tokens.access_token ? '✅ Presente' : '❌ Faltante',
      refresh_token: tokens.refresh_token ? '✅ Presente' : '❌ Faltante',
      expires_at: tokens.expires_at ? new Date(tokens.expires_at).toLocaleString() : '❌ Faltante'
    });
    
    if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
      console.error('❌ Tokens inválidos para guardar:', tokens);
      return;
    }
    
    fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
    console.log('✅ Tokens guardados correctamente en:', tokensPath);
    
    // Verificar que se guardó
    const saved = fs.readFileSync(tokensPath, 'utf-8');
    console.log('📋 Contenido guardado:', saved.substring(0, 100) + '...');
  } catch (err) {
    console.error('❌ Error al guardar tokens:', err.message);
  }
};