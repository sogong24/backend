// test/noteController.test.js
// noinspection JSUnresolvedReference,DuplicatedCode,JSCheckFunctionSignatures

const request = require('supertest');
const express = require('express');
const noteController = require('../controllers/noteController');
const Note = require('../models/Note');
const User = require('../models/User');
const path = require("node:path");
const fs = require("node:fs");
const multer = require("multer");

require('dotenv').config({path: path.join(__dirname, '.env')});

jest.mock('../models/Note');
jest.mock('../models/User');

const app = express();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({storage});

app.get('/api/notes/:courseID', noteController.retrieveNoteList);
app.post('/api/notes', upload.single('file'), noteController.uploadNote);
app.post('/api/notes/:noteID/like', noteController.likeNote);
app.post('/api/notes/:noteID/dislike', noteController.dislikeNote);
app.post('/api/notes/:noteID/purchase/:userID', noteController.purchaseNote);
app.get('/api/notes/:noteID/download/:userID', noteController.downloadNote);
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
                where: {courseID},
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
            expect(response.body).toEqual({error: errorMessage});
        });
    });

    describe('POST /api/notes', () => {
        it('should create a new note', async () => {
            // Arrange
            const user = {
                id: 'u1',
                point: 5,
                save: jest.fn().mockResolvedValue()
            }
            const noteData = {
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description'
            };
            User.findByPk.mockResolvedValue(user);
            const createdNote = {id: 'n1', ...noteData};
            Note.create.mockResolvedValue(createdNote);

            const testFilePath = path.join(__dirname, '../uploads/test.pdf');
            const previewImagePath = path.join(__dirname, '../uploads/previews/undefined-preview-1.png');

            // Act
            const response = await request(app)
                .post('/api/notes')
                .field('uploaderID', noteData.uploaderID)
                .field('courseID', noteData.courseID)
                .field('title', noteData.title)
                .field('description', noteData.description)
                .attach('file', testFilePath);

            // Assert
            expect(Note.create).toHaveBeenCalledWith(expect.objectContaining(noteData));
            expect(User.findByPk).toHaveBeenCalledWith(user.id);
            expect(response.status).toBe(201);
            expect(response.body.note).toEqual(createdNote);
            expect(response.body.previewImage).toBe('No Error');
            expect(user.point).toBe(5 + 10);

            // Clean up
            fs.unlinkSync(previewImagePath);
        });

        it('should return error when attached no file', async () => {
            //Arrange
            const noteData = {
                id: 'n1',
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description'
            };

            // Act
            const response = await request(app).post('/api/notes').send(noteData);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('File is required');
        });

        it('should return error when not attached pdf file', async () => {
            // Arrange
            const user = {
                id: 'u1'
            }
            const noteData = {
                id: 'n1',
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description'
            };
            User.findByPk.mockResolvedValue(user);
            Note.create.mockResolvedValue(noteData);

            const mockFilePath = path.join(__dirname, '../uploads/test.txt');
            fs.writeFileSync(mockFilePath, 'Mock file content');

            // Act
            const response = await request(app)
                .post('/api/notes')
                .field('uploaderID', noteData.uploaderID)
                .field('courseID', noteData.courseID)
                .field('title', noteData.title)
                .field('description', noteData.description)
                .attach('file', mockFilePath);

            // Assert
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Only PDF files are allowed');

            // Clean up
            fs.unlinkSync(mockFilePath);
        });

        it('should handle errors', async () => {
            // Arrange
            const user = {
                id: 'u1'
            };
            const noteData = {
                uploaderID: 'u1',
                courseID: 'c1',
                title: 'New Note',
                description: 'Note description',
            };
            User.findByPk.mockResolvedValue(user);
            const errorMessage = 'Database error';
            Note.create.mockRejectedValue(new Error(errorMessage));

            const testFilePath = path.join(__dirname, '../uploads/test.pdf');
            const previewImagePath = path.join(__dirname, '../uploads/previews/undefined-preview-1.png');

            // Act
            const response = await request(app)
                .post('/api/notes')
                .field('uploaderID', noteData.uploaderID)
                .field('courseID', noteData.courseID)
                .field('title', noteData.title)
                .field('description', noteData.description)
                .attach('file', testFilePath);

            // Assert
            expect(response.status).toBe(500);
            expect(response.body).toEqual({error: errorMessage});

            // Clean up
            fs.unlinkSync(previewImagePath);
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
            const expectedNote = {id: 'n1', likesCount: 11};
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
            expect(response.body).toEqual({error: 'Note not found'});
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
            expect(response.body).toEqual({error: errorMessage});
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
            const expectedNote = {id: 'n1', dislikesCount: 6};
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
            expect(response.body).toEqual({error: 'Note not found'});
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
            expect(response.body).toEqual({error: errorMessage});
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
            const note = {id: noteID, save: jest.fn().mockResolvedValue()};
            User.findByPk.mockResolvedValue(user);
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(user.accessibleNoteIDs).toContain(noteID);
            expect(user.point).toBe(2 - 1);
            expect(user.save).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = {id: 'n1'};
            expect(response.body.note).toMatchObject(expectedNote);
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
            expect(response.body).toEqual({error: 'User not found'});
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
            expect(response.body).toEqual({error: 'Note not found'});
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
            const note = {id: noteID, save: jest.fn().mockResolvedValue()};
            User.findByPk.mockResolvedValue(user);
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).post(`/api/notes/${noteID}/purchase/${userID}`);

            // Assert
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(403);
            expect(response.body).toEqual({error: 'Not enough points'});
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
            expect(response.body).toEqual({error: errorMessage});
        });
    });

    describe('GET /api/notes/:noteID/download/:userID', () => {
        it('should return the note for download', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const extraPath = '/uploads/test.txt';
            const mockFilePath = path.join(__dirname, '..', extraPath);
            fs.writeFileSync(mockFilePath, 'This is a mock file content.');

            const user = {
                id: userID,
                accessibleNoteIDs: [noteID]
            }

            const note = {
                id: noteID,
                title: 'Note 1',
                description: 'Description 1',
                fileURL: 'http://localhost:3000' + extraPath,
                save: jest.fn().mockResolvedValue(),
            };
            Note.findByPk.mockResolvedValue(note);
            User.findByPk.mockResolvedValue(user);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download/${userID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('text/plain; charset=UTF-8');

            // Clean up
            fs.unlinkSync(mockFilePath);
        });

        it('should return 404 if note not found', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            Note.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download/${userID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({error: 'Note not found'});
        });

        it('should return 404 if user not found', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            Note.findByPk.mockResolvedValue(noteID);
            User.findByPk.mockResolvedValue(null);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download/${userID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({error: 'User not found'});
        });

        it('should return 400 if user has no permissions', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const note = {
                id: noteID,
                title: 'Note 1',
                description: 'Description 1',
                fileURL: 'http://localhost:3000/uplodas/permissionError.txt',
                save: jest.fn().mockResolvedValue()
            };
            const user = {
                id: userID,
                accessibleNoteIDs: []
            }
            Note.findByPk.mockResolvedValue(note);
            User.findByPk.mockResolvedValue(user);

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download/${userID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(User.findByPk).toHaveBeenCalledWith(userID);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('No download permissions');
        });

        it('should handle errors', async () => {
            // Arrange
            const noteID = 'n1';
            const userID = 'u1';
            const errorMessage = 'Database error';
            Note.findByPk.mockRejectedValue(new Error(errorMessage));

            // Act
            const response = await request(app).get(`/api/notes/${noteID}/download/${userID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({error: errorMessage});
        });
    });

    describe('DELETE /api/notes/:noteID', () => {
        it('should delete and return the note', async () => {
            // Arrange
            const noteID = 'n1';
            const note = {
                id: noteID,
                destroy: jest.fn().mockResolvedValue(),
            };
            Note.findByPk.mockResolvedValue(note);

            // Act
            const response = await request(app).delete(`/api/notes/${noteID}`);

            // Assert
            expect(Note.findByPk).toHaveBeenCalledWith(noteID);
            expect(note.destroy).toHaveBeenCalled();
            expect(response.status).toBe(200);
            const expectedNote = {id: 'n1'};
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
            expect(response.body).toEqual({error: 'Note not found'});
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
            expect(response.body).toEqual({error: errorMessage});
        });
    });
});