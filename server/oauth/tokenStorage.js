
let tokens = {
  access_token: null,
  refresh_token: null,
  expires_at: null,
};

export const getTokens = () => tokens;

export const setTokens = (newTokens) => {
  tokens = { ...tokens, ...newTokens };
};

// Exporta también la función para guardar los tokens
export const saveTokens = (tokenData) => {
  const expires_at = Date.now() + tokenData.expires_in * 1000;
  setTokens({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at,
  });
};
