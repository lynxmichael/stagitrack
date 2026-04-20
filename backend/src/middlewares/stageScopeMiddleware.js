/**
 * Filtre automatiquement les requêtes selon le type_conseiller du user JWT.
 * Injecte `req.allowedTypes` dans la requête pour les services.
 */
module.exports = (req, res, next) => {
  const { role, type_conseiller } = req.user || {};

  if (role === 'admin') {
    req.allowedTypes = ['ecole', 'validation', 'qualification'];
    return next();
  }

  const map = {
    ecole_validation: ['ecole', 'validation'],
    qualification:    ['qualification'],
    les_deux:         ['ecole', 'validation', 'qualification'],
  };

  req.allowedTypes = map[type_conseiller] || [];

  // Si un type_stage est fourni en query/body, vérifier qu'il est autorisé
  const requestedType = req.query.type_stage || req.body?.type_stage;
  if (requestedType && !req.allowedTypes.includes(requestedType)) {
    return res.status(403).json({ message: 'Accès refusé à ce type de stage' });
  }

  next();
};
