// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { UUIDV4 } = DataTypes;

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    point: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dislikeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    accessibleNoteIDs: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;