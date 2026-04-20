const router = require('express').Router();
const ctrl   = require('../controllers/alerteController');
const auth   = require('../middlewares/authMiddleware');
const scope  = require('../middlewares/stageScopeMiddleware');

router.use(auth, scope);

router.get('/',                   ctrl.getAll);
router.patch('/:id/resolve',      ctrl.markResolved);
router.delete('/:id',             ctrl.delete);

module.exports = router;
