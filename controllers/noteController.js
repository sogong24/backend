// controllers/noteController.js
const Note = require('../models/Note');
const User = require('../models/User');
const path = require("node:path");
const { Poppler } = require("node-poppler");
const fs = require("node:fs");

exports.retrieveNoteList = async (req, res) => {
    const {courseID} = req.params;
    try {
        const notes = await Note.findAll({
            where: {courseID},
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// previewURL 관련 기능 추가 필요
exports.uploadNote = async (req, res) => {
    const {uploaderID, courseID, title, description} = req.body;

    try {
        // Multer로 업로드된 파일 확인
        const file = req.file;
        if (!file) {
            return res.status(400).json({error: "File is required"});
        }

        const pdfBytes = fs.readFileSync(file.path);

        const poppler = new Poppler();
        const option = {
            firstPageToConvert: 1,
            lastPageToConvert: 1,
            pngFile: true
        }

        const previewImageName = `uploads/previews/${file.filename}-preview`;
        const previewImage = await poppler.pdfToCairo(pdfBytes, previewImageName, option);

        const previewURL = `${req.protocol}://${req.get("host")}/${previewImageName}`;
        const fileURL = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        const note = await Note.create({
            uploaderID,
            courseID,
            title,
            description,
            fileURL,
            previewURL,
        });

        res.status(201).json({note, previewImage});
    } catch (error) {
        console.error("Error during upload:", error.message);
        res.status(500).json({error: error.message});
    }
};

exports.likeNote = async (req, res) => {
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});
        note.likesCount += 1;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.dislikeNote = async (req, res) => {
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});
        note.dislikesCount += 1;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.purchaseNote = async (req, res) => {
    const {userID, noteID} = req.params;
    try {
        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({error: 'User not found'});

        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        if (user.point <= 0) {
            return res.status(403).json({error: 'Not enough points'});
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
        res.status(500).json({error: error.message});
    }
};

exports.downloadNote = async (req, res) => {
    const {noteID, userID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        const user = await User.findByPk(userID);
        if (!user) return res.status(404).json({error: 'User not found'});

        if (!user.accessibleNoteIDs.includes(noteID)) {
            return res.status(400).json({error: 'No download permissions'});
        }

        const relativeFilePath = '.' + new URL(note.fileURL).pathname;
        let filePath = path.resolve(relativeFilePath);

        // Replace %20 (blank encoding code) to blank
        filePath = decodeURIComponent(filePath).replace(/\+/g, ' ');

        res.download(filePath, (err) => {
            if (err) {
                res.status(500).json({error: 'Failed to download file'});
            }
        })

    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteNote = async (req, res) => {
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        await note.destroy();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};