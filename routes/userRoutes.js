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

// 포인트 관련 새로운 라우트들
router.post('/points/check-download/:noteID', auth, userController.checkDownloadPoint);
router.post('/points/add-upload', auth, userController.addUploadPoint);
router.get('/points', auth, userController.getPoints);

module.exports = router;