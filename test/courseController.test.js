// test/courseController.test.js
const request = require('supertest');
const express = require('express');
const courseController = require('../controllers/courseController');

const app = express();
app.get('/courses', courseController.retrieveCourseList);

describe('GET /courses', () => {
    it('There are 2 courses for 1-1', async () => {
        const response = await request(app).get('/courses').query({grade: 1, semester: 1});

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });
});

describe('GET /courses', () => {
    it('There are 6 courses for 3-2', async () => {
        const response = await request(app).get('/courses').query({grade: 3, semester: 2});

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(6);
    });
});

describe('GET /notes', () => {
    it('There are 2 notes for the C_LANGUAGE_LAB_1 course.', async () => {
        const response = await request(app).get('/notes').query({grade: 3, semester: 2});

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(6);
    });
});