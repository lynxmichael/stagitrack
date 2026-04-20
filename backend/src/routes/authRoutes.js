const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const auth   = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/login', authLimiter, ctrl.login);
router.get('/me', auth, ctrl.me);

module.exports = router;
