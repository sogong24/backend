// controllers/courseController.js
const Course = require('../models/Course');

exports.retrieveCourseList = async (req, res) => {
    const {grade, semester} = req.query;
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
        res.status(500).json({error: error.message});
    }
};

exports.retrieveCourseDetail = async (req, res) => {
    const {courseID} = req.param;
    try {
        const course = await Course.findByPk(courseID);
        res.json(course);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};