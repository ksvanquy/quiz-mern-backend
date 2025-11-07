const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User routes
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers); 
router.get('/:id', authenticate, authorize(['admin','teacher','student']), userController.getUserById);
router.put('/:id', authenticate, authorize(['admin']), userController.updateUser);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
