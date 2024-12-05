const sequelize = require('../config/database');
const Course = require('../models/Course');
const { courses } = require('./data');

async function seedCourses() {
    try {
        // 데이터베이스 연결
        await sequelize.authenticate();

        // courses 테이블만 삭제
        await Course.drop();

        // 데이터베이스 동기화 (기존 테이블은 유지하고 변경된 테이블만 수정)
        await sequelize.sync({ alter: true });

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

