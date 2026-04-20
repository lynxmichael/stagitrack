const userService = require('../services/userService');

exports.getAll = async (req, res, next) => {
  try { res.json(await userService.getAll()); } catch (e) { next(e); }
};

exports.getById = async (req, res, next) => {
  try { res.json(await userService.getById(req.params.id)); } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try { res.json(await userService.update(req.params.id, req.body)); } catch (e) { next(e); }
};

exports.delete = async (req, res, next) => {
  try {
    // Empêcher la suppression de son propre compte
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'Impossible de supprimer votre propre compte' });
    await userService.delete(req.params.id);
    res.json({ message: 'Conseiller supprimé' });
  } catch (e) { next(e); }
};
