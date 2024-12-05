// noinspection JSUnresolvedReference

const request = require('supertest');
const express = require('express');
const userController = require("../controllers/userController");
const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

jest.mock('../models/User');

const app = express();
app.use(express.json());

app.post('/api/users/signup', userController.signUp);
app.post('/api/users/login', userController.logIn);

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/signup', () => {
        it('should return ID of created user', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw',
                username: 'test'
            };
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({id: 1, ...userData});

            // Act
            const response = await request(app).post('/api/users/signup').send(userData);

            // Assert
            expect(response.status).toBe(201);
            expect(response.body.userId).toBe(1);
        });

        it('should return error if email already in use', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw',
                username: 'test'
            };

            User.findOne.mockResolvedValue(userData);

            // Act
            const response = await request(app).post('/api/users/signup').send(userData);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already in use');
        });

        it('should handle errors', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw',
                username: 'test'
            };

            User.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            const response = await request(app).post('/api/users/signup').send(userData);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /api/users/login', () => {
        it('should return a token for valid credentials', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw'
            };
            const user = {
                id: 1,
                email: 'mock@uos.ac.kr',
                passwordHash: await bcrypt.hash('mockpw', 10)
            };
            User.findOne.mockResolvedValue(user);
            const token = 'mockToken';
            // noinspection JSCheckFunctionSignatures
            jest.spyOn(jwt, 'sign').mockReturnValue(token);

            // Act
            const response = await request(app).post('/api/users/login').send(userData);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body.token).toBe(token);
        });

        it('should return error for invalid email', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw'
            };
            User.findOne.mockResolvedValue(null);

            // Act
            const response = await request(app).post('/api/users/login').send(userData);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should return error for invalid password', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'wrongpw'
            };
            const user = {
                id: 1,
                email: 'mock@uos.ac.kr',
                passwordHash: await bcrypt.hash('mockpw', 10)
            };
            User.findOne.mockResolvedValue(user);

            // Act
            const response = await request(app).post('/api/users/login').send(userData);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should handle errors', async () => {
            // Arrange
            const userData = {
                email: 'mock@uos.ac.kr',
                password: 'mockpw'
            };
            User.findOne.mockRejectedValue(new Error('Database error'));

            // Act
            const response = await request(app).post('/api/users/login').send(userData);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });
});
