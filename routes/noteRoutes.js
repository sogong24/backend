// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');
const multer = require('multer');


// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  
const upload = multer({ storage: storage });

// GET /api/notes/:courseID
router.get('/:courseID', noteController.retrieveNoteList);

// POST /api/notes
router.post('/', upload.single('file'), noteController.uploadNote);

// POST /api/notes/:noteID/like
router.post('/:noteID/like', auth, noteController.likeNote);

// POST /api/notes/:noteID/dislike
router.post('/:noteID/dislike', auth, noteController.dislikeNote);

// Additional routes for purchase, download, delete can be added here

module.exports = router;