import { getTokens, setTokens } from './tokens.js';

// No es necesario mantener una ruta de archivo, ya que trabajamos con variables en memoria
// Aseguramos que los tokens se gestionen solo en memoria

export const getTokensFromMemory = () => {
  // Devuelve los tokens almacenados en memoria
  return getTokens();
};

export function saveTokensToMemory(tokenData) {
  // Calculamos el tiempo de expiración y guardamos los tokens en memoria
  const expires_at = Date.now() + tokenData.expires_in * 1000;
  
  setTokens({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at,
  });
}

export function loadTokensFromMemory() {
  // Devuelve los tokens desde la memoria
  return getTokens();
}
