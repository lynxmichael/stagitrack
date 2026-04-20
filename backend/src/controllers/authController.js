const authService = require('../services/authService');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) { next(err); }
};

exports.me = (req, res) => {
  res.json(req.user);
};
