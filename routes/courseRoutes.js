// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// GET /api/courses?grade=1&semester=2
router.get('/', auth, courseController.retrieveCourseList);

// GET /api/courses
router.get('/detail', auth, courseController.retrieveCourseDetail);

module.exports = router;