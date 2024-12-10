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