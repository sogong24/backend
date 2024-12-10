// controllers/userController.js
// noinspection JSCheckFunctionSignatures

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, passwordHash, username, point: 10 });
        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Successful login', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.editUserInfo = async (req, res) => {
    const { userId } = req.user;
    const { password, username } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (password) {
            user.passwordHash = await bcrypt.hash(password, 10);
        }
        if (username) {
            user.username = username;
        }
        await user.save();
        res.json({ message: 'User information updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.retrieveUserInfo = async (req, res) => {
    const { userId } = req.user;
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//임시 - 마이페이지용
exports.getUserById = async (req, res) => {
    const { userId } = req.params;  // URL에서 userId를 받음
    try {
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 다운로드 전 포인트 확인 및 차감
exports.checkDownloadPoint = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const noteId = req.params.noteId;

        // 이미 다운로드한 노트인지 확인
        if (user.accessibleNoteIDs.includes(noteId)) {
            return res.json({ success: true, message: '이미 다운로드한 노트입니다.' });
        }

        // 포인트 확인
        if (user.point < 1) {
            return res.status(402).json({ 
                message: '포인트가 부족합니다.',
                currentPoint: user.point 
            });
        }

        // 포인트 차감 및 accessibleNoteIDs 업데이트
        await user.update({
            point: user.point - 1,
            accessibleNoteIDs: [...user.accessibleNoteIDs, noteId]
        });

        res.json({ 
            success: true, 
            message: '포인트가 차감되었습니다.',
            currentPoint: user.point - 1
        });
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 노트 업로드 시 포인트 추가
exports.addUploadPoint = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        
        await user.update({
            point: user.point + 5  // 업로드 시 5포인트 추가
        });

        res.json({ 
            success: true, 
            message: '포인트가 추가되었습니다.',
            currentPoint: user.point + 5
        });
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};

// 현재 포인트 조회
exports.getPoints = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({ point: user.point });
    } catch (error) {
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
};