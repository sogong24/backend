// controllers/noteController.js
const Note = require('../models/Note');
const User = require('../models/User');
const path = require("node:path");
const pdf = require("pdf-poppler");

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
    const { uploaderID, courseID, title, description } = req.body;

    try {
        // Multer로 업로드된 파일 확인
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "File is required" });
        }

        // PDF 파일 경로 및 출력 디렉터리 생성
        const pdfPath = path.join(__dirname, "../uploads", file.filename); // 업로드된 PDF 파일 경로
        const outputDir = path.join(__dirname, "../uploads"); // 출력 디렉터리

        // Step 1: Poppler 옵션 설정
        const options = {
            format: "png", // 출력 이미지 포맷
            out_dir: outputDir, // 출력 디렉터리
            out_prefix: `${file.filename}-preview`, // 출력 파일 이름 접두사
            page: 1, // 첫 번째 페이지만 변환
        };

        // Step 2: PDF 첫 페이지를 PNG 이미지로 변환
        await pdf.convert(pdfPath, options);

        // Step 3: 변환된 이미지 파일 경로 생성
        const previewImageName = `${file.filename}-preview-1.png`;
        const previewImagePath = path.join(outputDir, previewImageName);
        const previewURL = `${req.protocol}://${req.get("host")}/uploads/${previewImageName}`;

        // Step 4: PDF URL 생성
        const fileURL = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        // Step 5: 데이터베이스에 저장
        const note = await Note.create({
            uploaderID,
            courseID,
            title,
            description,
            fileURL,
            previewURL,
        });

        // 성공 응답
        res.status(201).json(note);
    } catch (error) {
        console.error("Error during upload:", error.message);
        res.status(500).json({ error: error.message });
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