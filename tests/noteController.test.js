// test/noteController.test.js
const request = require('supertest');
const express = require('express');
const noteController = require('../controllers/noteController');
const Note = require('../models/Note');
const User = require('../models/User');

jest.mock('../models/Note');
jest.mock('../models/User');

const app = express();
app.use(express.json());

app.get('/api/notes/:courseID', noteController.retrieveNoteList);
app.post('/api/notes', noteController.uploadNote);
app.post('/api/notes/:noteID/like', noteController.likeNote);
app.post('/api/notes/:noteID/dislike', noteController.dislikeNote);
app.post('/api/notes/:noteID/purchase/:userID', noteController.purchaseNote);
app.get('/api/notes/:noteID/download', noteController.downloadNote);
app.delete('/api/notes/:noteID', noteController.deleteNote);

describe('Note Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/notes/:courseID', () => {
        it('should return 2 notes for the given courseID', async () => {
            // Arrange
            const courseID = 'c1';
            const mockNotes = [
                {
                    id: 'n1',
                    courseID,
                    title: 'Note 1',
                    description: 'Description 1',
                },
                {
                    id: 'n2',
                    courseID,
                    title: 'Note 2',
                    description: 'Description 2',
                },
            ];
            Note.findAll.mockResolvedValue(mockNotes);

            // Act
            const response = await request(app).get(`/api/notes/${courseID}`);

            // Assert
            expect(Note.findAll).toHaveBeenCalledWith({
                where: { courseID },
            });
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body).toEqual(mockNotes);
        });

        it('should handle errors', async () => {
            // Arrange
            const courseID = 'c1';
            const errorMessage = 'Database error';
            Note.findAll.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).get(`/api/notes/${courseID}`);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /api/notes', () => {
        it('should create a new note', async () => {
            // Arrange
            const noteData = {
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description',
                previewURL: 'http://example.com/preview',
                fileURL: 'http://example.com/file',
            };
            const createdNote = { id: 'n1', ...noteData };
            Note.create.mockResolvedValue(createdNote);

            // Act
            const response = await request(app)
                .post('/api/notes')
                .send(noteData);

            // Assert
            expect(Note.create).toHaveBeenCalledWith(noteData);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdNote);
        });

        it('should handle errors', async () => {
            // Arrange
            const noteData = {
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description',
                previewURL: 'http://example.com/preview',
                fileURL: 'http://example.com/file',
            };
            const errorMessage = 'Database error';
            Note.create.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app)
                .post('/api/notes')
                .send(noteData);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /api/notes/:noteID/like', () => {
        it('should increment likesCount of the note', async () => {
            // Arrange
            const noteID = 'n1';
            const note = { 
                id: noteID, 
                likesCount: 10, 
                save: jest.fn().mockResolvedValue()
            };
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/like`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(note.likesCount).toBe(11);
            expect(note.save).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = { id: 'n1', likesCount: 11 };
            expect(response.body).toMatchObject(expectedNote);
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/like`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Note not found' });
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const errorMessage = 'Database error';
            Note.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/like`);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /api/notes/:noteID/dislike', () => {
        it('should increment dislikesCount of the note', async () => {
            // Arrange
            const noteID = 'n1';
            const note = { 
                id: noteID, 
                dislikesCount: 5, 
                save: jest.fn().mockResolvedValue()
            };
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/dislike`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(note.dislikesCount).toBe(6);
            expect(note.save).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = { id: 'n1', dislikesCount: 6 };
            expect(response.body).toMatchObject(expectedNote);
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/dislike`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Note not found' });
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const errorMessage = 'Database error';
            Note.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/dislike`);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('POST /api/notes/:noteID/purchase/:userID', () => {
        it('should purchase the note successfully', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const user = {
                id: userID,
                point: 2,
                accessibleNoteIDs: [],
                save: jest.fn().mockResolvedValue(),
            };
            const note = { id: noteID, save: jest.fn().mockResolvedValue() };
            User.findByPk.mockResolvedValue(user);
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(user.accessibleNoteIDs).toContain(noteID);
            expect(user.point).toBe(1);
            expect(user.save).toHaveBeenCalled();
            expect(note.save).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = { id: 'n1' };
            expect(response.body).toMatchObject(expectedNote);
        });

        it('should return 404 if user not found', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            User.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'User not found' });
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const user = {
                id: userID,
                point: 2,
                accessibleNoteIDs: [],
                save: jest.fn().mockResolvedValue(),
            };
            User.findByPk.mockResolvedValue(user);
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Note not found' });
        });

        it('should return 403 if user has not enough points', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const user = {
                id: userID,
                point: 0,
                accessibleNoteIDs: [],
                save: jest.fn().mockResolvedValue(),
            };
            const note = { id: noteID, save: jest.fn().mockResolvedValue() };
            User.findByPk.mockResolvedValue(user);
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(403);
            expect(response.body).toEqual({ error: 'Not enough points' });
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const errorMessage = 'Database error';
            User.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('GET /api/notes/:noteID/download', () => {
        it('should return the note for download', async () => {
            // Arrange
            const noteID = 'n1';
            const note = {
                id: noteID,
                title: 'Note 1',
                description: 'Description 1',
                save: jest.fn().mockResolvedValue(),
            };
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(200);
            const expectedNote = { id: 'n1', title: 'Note 1', description: 'Description 1' };
            expect(response.body).toMatchObject(expectedNote);
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Note not found' });
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const errorMessage = 'Database error';
            Note.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });

    describe('DELETE /api/notes/:noteID', () => {
        it('should delete and return the note', async () => {
            // Arrange
            const noteID = 'n1';
            const note = { 
                id: noteID, 
                destroy: jest.fn().mockResolvedValue(), 
                toJSON: () => ({ id: noteID }) 
            };
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).delete(`/api/notes/${noteID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(note.destroy).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = { id: 'n1' };
            expect(response.body).toMatchObject(expectedNote);
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).delete(`/api/notes/${noteID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Note not found' });
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const errorMessage = 'Database error';
            Note.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).delete(`/api/notes/${noteID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: errorMessage });
        });
    });
});