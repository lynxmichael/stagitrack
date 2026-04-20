const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Token manquant ou invalide' });

    const token = header.split(' ')[1];
    req.user = verify(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expiré ou invalide' });
  }
};
