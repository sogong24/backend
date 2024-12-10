// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// POST /api/users/signup
router.post('/signup', userController.signUp);

// POST /api/users/login
router.post('/login', userController.logIn);

// PUT /api/users
router.put('/', auth, userController.editUserInfo);

// GET /api/users/me
router.get('/me', auth, userController.retrieveUserInfo);

module.exports = router;