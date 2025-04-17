import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./oauth/tokens.json');

export const saveTokens = (tokens) => {
  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
};

export const getTokens = () => {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
};
