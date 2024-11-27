// models/Note.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Course = require('./Course');
const User = require('./User');

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uploadDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    uploaderID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    courseID: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    previewURL: {
        type: DataTypes.STRING,
        validate: {
            // isUrl: true,
        },
    },
    fileURL: {
        type: DataTypes.STRING,
        validate: {
            // isUrl: true,
        },
    },
    likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    dislikesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'notes',
    timestamps: false,
});

module.exports = Note;