const router = require('express').Router();
const ctrl   = require('../controllers/dashboardController');
const auth   = require('../middlewares/authMiddleware');
const scope  = require('../middlewares/stageScopeMiddleware');

router.use(auth, scope);

router.get('/stats',      ctrl.getStats);
router.get('/alertes',    ctrl.getAlertes);
router.get('/activities', ctrl.getActivities);

module.exports = router;
