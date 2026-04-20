const router = require('express').Router();
const ctrl   = require('../controllers/stagiaireController');
const auth   = require('../middlewares/authMiddleware');
const scope  = require('../middlewares/stageScopeMiddleware');

router.use(auth, scope);

router.get('/export/excel', ctrl.exportExcel);
router.get('/',             ctrl.getAll);
router.get('/:id',          ctrl.getById);
router.post('/',            ctrl.create);
router.put('/:id',          ctrl.update);
router.delete('/:id',       ctrl.delete);

module.exports = router;
