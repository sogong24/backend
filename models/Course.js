// models/Course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    professorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'courses',
    timestamps: false,
});

module.exports = Course;