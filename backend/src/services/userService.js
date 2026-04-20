const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  getAll: () => User.findAll(),

  getById: async (id) => {
    const user = await User.findById(id);
    if (!user) throw Object.assign(new Error('Conseiller introuvable'), { status: 404 });
    return user;
  },

  create: async ({ nom, prenom, email, password, role, type_conseiller, actif }) => {
    const existing = await User.findByEmail(email);
    if (existing) throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });
    const password_hash = await bcrypt.hash(password, 12);
    const id = await User.create({ nom, prenom, email, password_hash, role, type_conseiller, actif });
    return User.findById(id);
  },

  update: async (id, { nom, prenom, email, password, role, type_conseiller, actif }) => {
    const user = await User.findById(id);
    if (!user) throw Object.assign(new Error('Conseiller introuvable'), { status: 404 });
    const fields = { nom, prenom, email, role, type_conseiller, actif };
    if (password) fields.password_hash = await bcrypt.hash(password, 12);
    await User.update(id, fields);
    return User.findById(id);
  },

  delete: async (id) => {
    const user = await User.findById(id);
    if (!user) throw Object.assign(new Error('Conseiller introuvable'), { status: 404 });
    await User.delete(id);
  },
};
