const router = require('express').Router();
const ctrl   = require('../controllers/userController');
const auth   = require('../middlewares/authMiddleware');
const role   = require('../middlewares/roleMiddleware');

router.use(auth, role('admin'));

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
