// controllers/courseController.js
const Course = require('../models/Course');

exports.retrieveCourseList = async (req, res) => {
    const { grade, semester } = req.query;

    console.log('request parameters: ', {grade, semester });
    try {
        const courses = await Course.findAll({
            where: {
                grade: grade,
                semester: semester,
            },
        });

        console.log('database query: ', courses);

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};