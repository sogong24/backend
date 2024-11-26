// test/courseController.test.js
const request = require('supertest');
const express = require('express');
const courseController = require('../controllers/courseController');

const app = express();
app.get('/courses', courseController.retrieveCourseList);

describe('GET /courses', () => {
    it('should return the course list from the database', async () => {
        const response = await request(app).get('/courses').query({grade: 3, semester: 2});

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(6);
    });
});