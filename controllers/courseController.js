// controllers/courseController.js
const Course = require('../models/Course');

exports.retrieveCourseList = async (req, res) => {
    const { grade, semester } = req.query;
    try {
        const courses = await Course.findAll({
            where: {
                grade: grade,
                semester: semester,
            },
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};