const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'stagitrack_secret_fallback';
const EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

module.exports = {
  sign: (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES }),
  verify: (token) => jwt.verify(token, SECRET),
};
