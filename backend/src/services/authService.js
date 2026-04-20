const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwt');

module.exports = {
  login: async (email, password) => {
    const user = await User.findByEmail(email);
    if (!user) throw Object.assign(new Error('Identifiants invalides'), { status: 401 });
    if (!user.actif) throw Object.assign(new Error('Compte désactivé'), { status: 403 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw Object.assign(new Error('Identifiants invalides'), { status: 401 });

    const payload = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      type_conseiller: user.type_conseiller,
    };

    return { token: sign(payload), user: payload };
  },
};
