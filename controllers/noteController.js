// controllers/noteController.js
const Note = require('../models/Note');

exports.retrieveNoteList = async (req, res) => {
    const { courseID } = req.params;
    try {
        const notes = await Note.findAll({
            where: { courseID },
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadNote = async (req, res) => {
    const { uploaderID, courseID, title, description, previewURL, fileURL } = req.body;
    try {
        const note = await Note.create({
            uploaderID,
            courseID,
            title,
            description,
            previewURL,
            fileURL,
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.likeNote = async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        note.likesCount += 1;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.dislikeNote = async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        note.dislikesCount += 1;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Additional functions like purchaseNote, downloadNote, deleteNote can be implemented similarly