const sequelize = require('../config/database');
const Course = require('../models/Course');
const User = require('../models/User');
const Note = require('../models/Note');
const { courses } = require('./data');

async function seedCourses() {
    try {
        // 데이터베이스 연결
        // force: true를 통해 기존 DB는 삭제되고 새로 추가됨
        await sequelize.sync({ force: true });

        // 미리 정의된 데이터 삽입
        await Course.bulkCreate(courses);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
}

seedCourses();

