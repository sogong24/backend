// controllers/noteController.js
const Note = require('../models/Note');
const User = require('../models/User');

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

exports.purchaseNote = async (req, res) => {
    const { userID, noteID } = req.params;
    try {
        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        if (user.point <= 0) {
            return res.status(403).json({ error: 'Not enough points' });
        }

        if (!Array.isArray(user.accessibleNoteIDs)) {
            user.accessibleNoteIDs = [];
        }

        if (!user.accessibleNoteIDs.includes(noteID)) {
            user.accessibleNoteIDs.push(noteID);
            user.point -= 1;
        }

        await user.save();
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.downloadNote = async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        // Deduct user points.

        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    const { noteID } = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        await note.destroy();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};