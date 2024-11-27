// controllers/noteController.js
const Note = require('../models/Note');

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

exports.uploadNote = async (req, res) => {
    const {uploaderID, courseID, title, description} = req.body;
    try {
        // // Multer로 처리된 파일
        const file = req.file;
        if (!file) {
            return res.status(400).json({error: 'File is required'});
        }

        // 파일 이름을 URL 형식에 맞게 변경하는 함수(공백을 +로 변환)
        function encodeFileName(fileName) {
            return encodeURIComponent(fileName).replace(/%20/g, '+');
        }

        // 파일 경로 생성
        const fileURL = `${req.protocol}://${req.get('host')}/uploads/${encodeFileName(file.filename)}`;

        const note = await Note.create({
            uploaderID,
            courseID,
            title,
            description,
            // 프리뷰 추가
            fileURL
        });
        res.status(201).json(note);
    } catch (error) {
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

        if (user.point <= 0) return res.status(404).json({error: 'Not enough points'});

        user.accessibleNoteIDs.append(nodeID);
        user.point -= 1;

        await user.save();
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.downloadNote = async (req, res) => {
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        await note.save();
        res.json(note);
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