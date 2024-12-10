// controllers/noteController.js
const Note = require('../models/Note');
const User = require('../models/User');
const Course = require('../models/Course');
const path = require("node:path");
const {Poppler} = require("node-poppler");
const fs = require("node:fs");

exports.retrieveAllNotes = async (req, res) => {
   try {
       const allNotes = await Note.findAll();
       res.json(allNotes);
   } catch (error) {
       res.status(500).json({error: error.message});
   }
};

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

exports.retrieveNoteDetail = async (req, res) => {
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        res.json(note);
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

        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({error: 'Only PDF files are allowed'});
        }

        const user = await User.findByPk(uploaderID);
        if (!user) return res.status(404).json({error: 'User not found'});

        const pdfBytes = process.env.NODE_ENV === 'test'
            ? file.buffer : fs.readFileSync(file.path);

        const poppler = new Poppler();
        const option = {
            firstPageToConvert: 1,
            lastPageToConvert: 1,
            pngFile: true
        }

        const previewImagePath = `uploads/previews/${file.filename}-preview`;
        const previewImage = await poppler.pdfToCairo(pdfBytes, previewImagePath, option);

        const previewURL = `${req.protocol}://${req.get("host")}/${previewImagePath}`;
        const fileURL = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

        const note = await Note.create({
            uploaderID,
            courseID,
            title,
            description,
            fileURL,
            previewURL,
        });

        user.point += 10;
        await user.save();

        res.status(201).json({note, previewImage});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.likeNote = async (req, res) => {
    const {userId} = req.user;
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        if (userId === note.uploaderID) return res.status(400).json({error: 'Cannot like your own note'});

        const uploader = await User.findByPk(note.uploaderID);
        if (!uploader) return res.status(404).json({error: 'Uploader not found'});
        if (note.reviewedUserIDs.includes(userId)) return res.status(400).json({error: 'Already reviewed'});

        uploader.likeCount += 1;
        note.likeCount += 1;
        note.reviewedUserIDs.push(userId);

        await note.save({fields: ['likeCount', 'reviewedUserIDs']});
        await uploader.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.dislikeNote = async (req, res) => {
    const {userId} = req.user;
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        if (userId === note.uploaderID) return res.status(400).json({error: 'Cannot dislike your own note'});

        const uploader = await User.findByPk(note.uploaderID);
        if (!uploader) return res.status(404).json({error: 'Uploader not found'});
        if (note.reviewedUserIDs.includes(userId)) return res.status(400).json({error: 'Already reviewed'});

        uploader.dislikeCount += 1;
        note.dislikeCount += 1;
        note.reviewedUserIDs.push(userId);

        await note.save({fields: ['dislikeCount', 'reviewedUserIDs']});
        await uploader.save();
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

        const saveOptions = {
            fields: ['point', 'accessibleNoteIDs']
        };

        await user.save(saveOptions);
        res.json({user, note});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.downloadNote = async (req, res) => {
    const {noteID, userID} = req.params;
    try {
        console.log('다운로드 요청 정보:', {
            noteID,
            userID,
            params: req.params
        });

        const note = await Note.findByPk(noteID);
        if (!note) {
            console.log('노트를 찾을 수 없음:', noteID);
            return res.status(404).json({error: 'Note not found'});
        }

        const user = await User.findByPk(userID);
        if (!user) {
            console.log('사용자를 찾을 수 없음:', userID);
            return res.status(404).json({error: 'User not found'});
        }

        console.log('사용자의 접근 가능한 노트:', user.accessibleNoteIDs);
        
        if (!user.accessibleNoteIDs.includes(noteID)) {
            console.log('다운로드 권한 없음:', {
                userID,
                noteID,
                accessibleNotes: user.accessibleNoteIDs
            });
            return res.status(400).json({error: 'No download permissions'});
        }

        const relativeFilePath = '.' + new URL(note.fileURL).pathname;
        console.log('파일 경로:', relativeFilePath);
        
        let filePath = path.resolve(relativeFilePath);

        // Replace %20 (blank encoding code) to blank
        filePath = decodeURIComponent(filePath).replace(/\+/g, ' ');
        const fileName = `${note.title}.pdf`;

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('다운로드 에러:', err);
                res.status(500).json({error: 'Failed to download file'});
            }
        });

    } catch (error) {
        console.error('다운로드 처리 에러:', error);
        res.status(500).json({error: error.message});
    }
};

exports.getNoteDetail = async (req, res) => {
    try {
        const {noteID} = req.params;
        
        const note = await Note.findByPk(noteID, {
            include: [
                {
                    model: Course,
                    attributes: ['grade', 'semester', 'professorName']
                },
                {
                    model: User,
                    as: 'uploader',
                    attributes: ['username']
                }
            ]
        });

        if (!note) {
            return res.status(404).json({ message: '노트를 찾을 수 없습니다.' });
        }

        const noteDetail = {
            title: note.title,
            course: {
                grade: note.Course.grade,
                semester: note.Course.semester,
                professorName: note.Course.professorName
            },
            author: note.uploader.username,
            description: note.description,
            uploadDate: note.uploadDate
        };

        res.json(noteDetail);
    } catch (error) {
        console.error('노트 상세 조회 에러:', error);
        res.status(500).json({ message: '노트 정보 조회에 실패했습니다.' });
    }
};

exports.deleteNote = async (req, res) => {
    const {userId} = req.user;
    const {noteID} = req.params;
    try {
        const note = await Note.findByPk(noteID);
        if (!note) return res.status(404).json({error: 'Note not found'});

        const uploader = await User.findByPk(note.uploaderID);
        if (!uploader) return res.status(404).json({error: 'Uploader not found'});
        if (uploader.id !== userId) return res.status(400).json({error: 'Can only delete your own note'});

        if (uploader.point < 10) uploader.point = 0;
        else uploader.point -= 10;

        uploader.likeCount -= note.likeCount;
        uploader.dislikeCount -= note.dislikeCount;

        await note.destroy();
        await uploader.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};