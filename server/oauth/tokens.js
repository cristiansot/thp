// Variables en memoria para almacenar los tokens
let tokens = {
    access_token: null,
    refresh_token: null,
    expires_at: null,
  };
  
  // Obtiene los tokens almacenados en memoria
  export const getTokens = () => tokens;
  
  // Establece nuevos valores para los tokens en memoria
  export const setTokens = (newTokens) => {
    tokens = { ...tokens, ...newTokens };
  };
  
  // Guarda los tokens, calculando el tiempo de expiración
  export const saveTokens = (tokenData) => {
    const expires_at = Date.now() + tokenData.expires_in * 1000;
    
    setTokens({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at,
    });
  };
  
  // Carga los tokens desde la memoria
  export const loadTokens = () => getTokens();
  