const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.route('/').get(userController.getUsers).post(userController.createUser);

// router.param('id', userController.validateUserId);
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
