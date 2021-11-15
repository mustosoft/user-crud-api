const { requiredRoles: role } = require('../middlewares');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers');

/**
 * Users CRUD router
 */

const router = module.exports = require('express').Router();

router.get('/', role(['admin']), getAllUsers);
router.post('/', role(['admin']), createUser);

router.get('/:id', role(['admin', 'user']), getUser);
router.put('/:id', role(['admin']), updateUser);
router.patch('/:id', role(['admin']), updateUser);
router.delete('/:id', role(['admin']), deleteUser);
