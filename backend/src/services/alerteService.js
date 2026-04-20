const Alerte = require('../models/Alerte');

module.exports = {
  getAll: async (params, allowedTypes) => {
    return Alerte.findAll({ ...params, allowedTypes });
  },

  markResolved: async (id) => {
    await Alerte.markResolved(id);
  },

  delete: async (id) => {
    await Alerte.delete(id);
  },

  createIfNotExists: async (stagiaire_id, type, titre, description) => {
    const exists = await Alerte.existsForStagiaire(stagiaire_id, type);
    if (!exists) await Alerte.create({ stagiaire_id, type, titre, description });
  },
};
