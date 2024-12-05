// test/courseController.test.js
// noinspection JSUnresolvedReference

const request = require('supertest');
const express = require('express');
const courseController = require('../controllers/courseController');
const Course = require('../models/Course');

jest.mock('../models/Course');

const app = express();
app.use(express.json());
app.get('/api/courses', courseController.retrieveCourseList);

describe('Course Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/courses', () => {
        it('should return 2 courses for grade 1 and semester 1', async () => {
            // Arrange
            const mockCourses = [
                {
                    id: 'c1',
                    grade: 1,
                    semester: 1,
                    title: 'Intro to Programming',
                    professorName: 'Prof. A',
                },
                {
                    id: 'c2',
                    grade: 1,
                    semester: 1,
                    title: 'Computer Science Basics',
                    professorName: 'Prof. B',
                },
            ];
            Course.findAll.mockResolvedValue(mockCourses);

            // Act
            const response = await request(app)
                .get('/api/courses')
                .query({grade: 1, semester: 1});

            // Assert
            expect(Course.findAll).toHaveBeenCalledWith({
                where: {
                    grade: '1',
                    semester: '1',
                },
            });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body).toEqual(mockCourses);
        });

        it('should return 6 courses for grade 3 and semester 2', async () => {
            // Arrange
            const mockCourses = [
                {id: 'c1', grade: 3, semester: 2, title: 'Course 1', professorName: 'Prof. A'},
                {id: 'c2', grade: 3, semester: 2, title: 'Course 2', professorName: 'Prof. B'},
                {id: 'c3', grade: 3, semester: 2, title: 'Course 3', professorName: 'Prof. C'},
                {id: 'c4', grade: 3, semester: 2, title: 'Course 4', professorName: 'Prof. D'},
                {id: 'c5', grade: 3, semester: 2, title: 'Course 5', professorName: 'Prof. E'},
                {id: 'c6', grade: 3, semester: 2, title: 'Course 6', professorName: 'Prof. F'},
            ];
            Course.findAll.mockResolvedValue(mockCourses);

            // Act
            const response = await request(app)
                .get('/api/courses')
                .query({grade: 3, semester: 2});

            // Assert
            expect(Course.findAll).toHaveBeenCalledWith({
                where: {
                    grade: '3',
                    semester: '2',
                },
            });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(6);
            expect(response.body).toEqual(mockCourses);
        });

        it('should handle errors', async () => {
            // Arrange
            const errorMessage = 'Database error';
            Course.findAll.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app)
                .get('/api/courses')
                .query({grade: 1, semester: 1});

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({error: errorMessage});
        });
    });
});