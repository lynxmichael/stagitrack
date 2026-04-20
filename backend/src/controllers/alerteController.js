const alerteService = require('../services/alerteService');

exports.getAll = async (req, res, next) => {
  try {
    const alertes = await alerteService.getAll(req.query, req.allowedTypes);
    res.json(alertes);
  } catch (e) { next(e); }
};

exports.markResolved = async (req, res, next) => {
  try {
    await alerteService.markResolved(req.params.id);
    res.json({ message: 'Alerte résolue' });
  } catch (e) { next(e); }
};

exports.delete = async (req, res, next) => {
  try {
    await alerteService.delete(req.params.id);
    res.json({ message: 'Alerte supprimée' });
  } catch (e) { next(e); }
};
