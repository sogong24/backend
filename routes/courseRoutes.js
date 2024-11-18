// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/courses?grade=1&semester=2
router.get('/', courseController.retrieveCourseList);

module.exports = router;