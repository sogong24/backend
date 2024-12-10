// models/Note.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Course = require('./Course');
// const User = require('./User');

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
    uploaderName: {
        type: DataTypes.STRING,
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
    },
    fileURL: {
        type: DataTypes.STRING,
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    dislikeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    reviewedUserIDs: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: []
    }
}, {
    tableName: 'notes',
    timestamps: false,
});

// Note.belongsTo(Course, { foreignKey: 'courseID' });
// Note.belongsTo(User, { foreignKey: 'uploaderID' });

module.exports = Note;