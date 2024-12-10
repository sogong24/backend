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

// GET /api/notes
router.get('/', auth, noteController.retrieveAllNotes);

// GET /api/notes/:courseID
router.get('/:courseID', auth, noteController.retrieveNoteList);

// GET /api/notes/detail/:noteID
router.get('/detail/:noteID', auth, noteController.retrieveNoteDetail);

// POST /api/notes
router.post('/', auth, upload.single('file'), noteController.uploadNote);

// POST /api/notes/:noteID/like
router.post('/:noteID/like', auth, noteController.likeNote);

// POST /api/notes/:noteID/dislike
router.post('/:noteID/dislike', auth, noteController.dislikeNote);

// POST /api/notes/:noteID/purchase
router.post('/:noteID/purchase', auth, noteController.purchaseNote);

// GET /api/notes/:noteID/download
router.get('/:noteID/download', auth, noteController.downloadNote);

// DELETE /api/notes/:noteID
router.delete('/:noteID', auth, noteController.deleteNote);

module.exports = router;