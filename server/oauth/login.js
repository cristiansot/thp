export function login(req, res) {
  const clientId = process.env.ML_CLIENT_ID;
  const redirectUri = process.env.ML_REDIRECT_URI;

  const url = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  console.log('Redirigiendo a:', url); // Esto te ayuda a verificar qué URL estás generando

  res.redirect(url);
}
