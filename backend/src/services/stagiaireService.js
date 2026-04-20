const Stagiaire = require('../models/Stagiaire');

module.exports = {
  getAll: async (filters, allowedTypes) => {
    return Stagiaire.findAll({ ...filters, allowedTypes });
  },

  getById: async (id, allowedTypes) => {
    const s = await Stagiaire.findById(id);
    if (!s) throw Object.assign(new Error('Stagiaire introuvable'), { status: 404 });
    if (allowedTypes.length && !allowedTypes.includes(s.type_stage))
      throw Object.assign(new Error('Accès refusé à ce stagiaire'), { status: 403 });
    return s;
  },

  create: async (data, conseiller_id) => {
    const id = await Stagiaire.create({ ...data, conseiller_id });
    return Stagiaire.findById(id);
  },

  update: async (id, data, allowedTypes) => {
    const existing = await Stagiaire.findById(id);
    if (!existing) throw Object.assign(new Error('Stagiaire introuvable'), { status: 404 });
    if (allowedTypes.length && !allowedTypes.includes(existing.type_stage))
      throw Object.assign(new Error('Accès refusé'), { status: 403 });
    await Stagiaire.update(id, data);
    return Stagiaire.findById(id);
  },

  delete: async (id, allowedTypes) => {
    const existing = await Stagiaire.findById(id);
    if (!existing) throw Object.assign(new Error('Stagiaire introuvable'), { status: 404 });
    if (allowedTypes.length && !allowedTypes.includes(existing.type_stage))
      throw Object.assign(new Error('Accès refusé'), { status: 403 });
    await Stagiaire.delete(id);
  },
};
