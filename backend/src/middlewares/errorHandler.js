const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Erreur interne du serveur'
    : err.message || 'Erreur interne';

  res.status(status).json({ message, ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }) });
};
