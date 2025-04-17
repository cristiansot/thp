import fs from 'fs';
import path from 'path';
import axios from 'axios';

const tokensPath = path.join(process.cwd(), 'server', 'tokens.json');

export async function getMLUserInfo() {
  if (!fs.existsSync(tokensPath)) throw new Error('No hay tokens guardados');

  const { access_token } = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

  const response = await axios.get('https://api.mercadolibre.com/users/me', {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return response.data;
}
