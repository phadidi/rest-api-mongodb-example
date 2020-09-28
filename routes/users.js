const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require('../controllers/users');

const User = require('../models/user');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

module.exports = router;
