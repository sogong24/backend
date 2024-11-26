// app.js
const express = require('express');
const sequelize = require('./config/database');
const courseRoutes = require('./routes/courseRoutes.js');
const noteRoutes = require('./routes/noteRoutes.js');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

const multer = require('multer');
const path = require('path');

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // 파일 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // 고유 파일 이름 생성
  }
});

// Middleware
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Backend Skeleton is Running');
});

// Sync Database and Start Server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('😢 Unable to connect to the database:', err);
    });