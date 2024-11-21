// test/courseController.test.js
const request = require('supertest');
const express = require('express');
const courseController = require('../controllers/courseController');
const Course = require('../models/Course');

const app = express();
app.get('/courses', courseController.retrieveCourseList);

describe('GET /courses', () => {
    // 테스트를 실행하면 DB에 데이터가 직접 저장됨
    it('Add course to DB', async () => {
        const newCourse = Course.create({
            year: 2024,
            grade: 3,
            semester: 2,
            title: '소프트웨어공학',
            professorName: '김지은'
        });

        const response = await request(app).get('/courses').query({grade: 3, semester: 2});
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(newCourse));
    });
});