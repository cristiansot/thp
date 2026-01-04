export function login(req, res) {
  const url = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${process.env.ML_CLIENT_ID}&redirect_uri=${process.env.ML_REDIRECT_URI}`;
  console.log('Redirigiendo a:', url);
  res.redirect(url);
}
