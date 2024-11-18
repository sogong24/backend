// __tests__/courseController.test.js
const request = require('supertest');
const express = require('express');
const courseController = require('../controllers/courseController');
const Course = require('../models/Course');

const app = express();
app.get('/courses', courseController.retrieveCourseList);

jest.mock('../models/Course');

describe('GET /courses', () => {
    it('should return a list of courses', async () => {
        const mockCourses = [
            { id: 1, name: 'Math', grade: '1', semester: '1' },
            { id: 2, name: 'Science', grade: '1', semester: '1' },
        ];
        Course.findAll.mockResolvedValue(mockCourses);

        const response = await request(app).get('/courses').query({ grade: '1', semester: '1' });
        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCourses);
    });

    it('should return a 500 error if there is a server error', async () => {
        Course.findAll.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/courses').query({ grade: '1', semester: '1' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
    });
});