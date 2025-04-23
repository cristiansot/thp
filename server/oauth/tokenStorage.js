import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./tokens.json');

let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null,
};

// Cargar tokens desde archivo al iniciar
if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const parsed = JSON.parse(fileContent);
    tokens = parsed;
  } catch (err) {
    console.error('⚠️ Error al leer tokens.json:', err.message);
  }
}

export const getTokens = () => {
  if (!tokens.access_token || !tokens.refresh_token || !tokens.expires_at) {
    console.warn('⚠️ Tokens incompletos o no encontrados. Retornando null.');
    return null;
  }
  return tokens;
};

export const setTokens = (newTokens) => {
  tokens = { ...tokens, ...newTokens };
  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
};

export const saveTokens = (tokenData) => {
  const expires_at = Date.now() + tokenData.expires_in * 1000;
  setTokens({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at,
  });
};
