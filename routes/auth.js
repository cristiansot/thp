import { getTokens } from '../oauth/tokenStorage.js';

export const checkTokens = (req, res) => {
  const tokens = getTokens();
  if (!tokens) {
    return res.status(404).json({ message: 'No tokens found' });
  }
  res.status(200).json({ message: 'Tokens OK', tokens });
};
