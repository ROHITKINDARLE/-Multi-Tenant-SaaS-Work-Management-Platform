const express = require('express');
const router = express.Router();
const userController = require('./user.controller');

// Get all users in organization
router.get('/', userController.getUsers);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Update user role
router.put('/:userId/role', userController.updateUserRole);

// Delete user
router.delete('/:userId', userController.deleteUser);

module.exports = router;
