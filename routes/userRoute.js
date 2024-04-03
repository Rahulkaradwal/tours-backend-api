const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require('./../controller/userController');

const router = express.Router();
router.route('/').get(getAllUsers).post(createUser);
router
  .route('/api/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
