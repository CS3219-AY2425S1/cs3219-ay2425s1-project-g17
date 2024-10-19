import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { app, connectToMongoDB } from '../app';
import Question from '../model/questionModel';
import { generateToken } from '../utils/tokenGenerator';
import dotenv from 'dotenv';

dotenv.config();

const token = generateToken('tester123');

before(async () => {
    const testUri = process.env.MONGO_URI_TEST || '';
    connectToMongoDB(testUri, "TEST");
});

afterEach(async () => {
    await Question.deleteMany({});
});

after(async () => {
    await mongoose.connection.close();
});

describe('Question Service Integration Tests', () => {
    describe('POST /questions', () => {
        it('should create a new question', async () => {
            const newQuestion = {
                question_title: 'What is the time complexity of binary search?',
                question_description: 'Explain the time complexity of binary search.',
                question_categories: ['Algorithms'],
                question_complexity: 'EASY',
                question_popularity: 100,
                question_examples: [
                    {
                        input: 'sorted array [1,2,3,4,5,6,7], target 5',
                        output: 'index 4',
                        explanation: 'Binary search divides the array in half at each step.',
                    },
                ],
            };

            const response = await request(app)
                .post('/questions')
                .set('Authorization', `Bearer ${token}`)
                .send(newQuestion);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('question_id');
            expect(response.body).to.have.property('question_title', newQuestion.question_title);
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteQuestion = {
                question_title: 'Missing complexity',
                question_description: 'This question is missing the complexity field.',
            };

            const response = await request(app)
                .post('/questions')
                .set('Authorization', `Bearer ${token}`)
                .send(incompleteQuestion);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
        });
    });

    describe('GET /questions/:id', () => {
        it('should get a question by its ID', async () => {
            const question = new Question({
                question_id: 1,
                question_title: 'What is a graph?',
                question_description: 'Explain the concept of a graph in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'MEDIUM',
                question_popularity: 75,
            });
            await question.save();

            const response = await request(app)
                .get(`/questions/1`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', 1);
        });

        it('should return 404 if the question does not exist', async () => {
            const response = await request(app)
                .get(`/questions/999`) // ID that doesn't exist
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('PUT /questions/:id', () => {
        it('should update an existing question', async () => {
            const question = new Question({
                question_id: 1,
                question_title: 'What is a queue?',
                question_description: 'Explain the concept of a queue in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'MEDIUM',
                question_popularity: 50,
            });
            await question.save();

            const updatedQuestion = {
                question_title: 'What is a queue?',
                question_description: 'A queue is a linear data structure.',
                question_categories: ['Data Structures'],
                question_complexity: 'EASY',
                question_popularity: 70,
            };

            const response = await request(app)
                .put(`/questions/1`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedQuestion);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', 1);
            expect(response.body).to.have.property('question_complexity', 'EASY');
        });

        it('should return 404 for non-existent question', async () => {
            const updatedQuestion = {
                question_title: 'Non-existent question',
                question_description: 'This question does not exist.',
                question_categories: ['Unknown'],
                question_complexity: 'MEDIUM',
                question_popularity: 30,
            };

            const response = await request(app)
                .put(`/questions/999`) // ID that doesn't exist
                .set('Authorization', `Bearer ${token}`)
                .send(updatedQuestion);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('DELETE /questions/:id', () => {
        it('should delete an existing question', async () => {
            const question = new Question({
                question_id: 1,
                question_title: 'What is a stack?',
                question_description: 'Explain the concept of a stack in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'HARD',
                question_popularity: 60,
            });
            await question.save();

            const response = await request(app)
                .delete(`/questions/1`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Question deleted and IDs adjusted');
        });

        it('should return 404 for non-existent question', async () => {
            const response = await request(app)
                .delete(`/questions/999`) // ID that doesn't exist
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('GET /questions', () => {
        it('should get all questions', async () => {
            const question1 = new Question({
                question_id: 1,
                question_title: 'What is a tree?',
                question_description: 'Explain the concept of a tree in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'EASY',
                question_popularity: 40,
            });
            const question2 = new Question({
                question_id: 2,
                question_title: 'What is a linked list?',
                question_description: 'Explain the concept of a linked list in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'MEDIUM',
                question_popularity: 45,
            });
            await question1.save();
            await question2.save();

            const response = await request(app)
                .get('/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').that.has.lengthOf(2);
        });

        it('should return 200 and an empty array if no questions exist', async () => {
            const response = await request(app)
                .get('/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });

    describe('GET /questions/categories', () => {
        it('should get unique question categories', async () => {
            const question = new Question({
                question_id: 1,
                question_title: 'What is a computer?',
                question_description: 'Explain the concept of a computer.',
                question_categories: ['Technology', 'Devices'],
                question_complexity: 'EASY',
                question_popularity: 20,
            });
            await question.save();

            const response = await request(app)
                .get('/questions/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.include.members(['Technology', 'Devices']);
        });

        it('should return 200 and an empty array if no categories exist', async () => {
            const response = await request(app)
                .get('/questions/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });

    describe('GET /questions/random', () => {
        it('should get a random question based on difficulty and category', async () => {
            const question = new Question({
                question_id: 1,
                question_title: 'What is a queue?',
                question_description: 'Explain the concept of a queue in data structures.',
                question_categories: ['Data Structures'],
                question_complexity: 'EASY',
                question_popularity: 50,
            });
            await question.save();

            const response = await request(app)
                .get('/questions/random?difficulty=EASY&category=Data Structures')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', 1);
        });

        it('should return 404 if no random question is found', async () => {
            const response = await request(app)
                .get('/questions/random?difficulty=HARD&category=Unknown')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'No questions found for the given difficulty and category');
        });
    });

    describe('POST /questions/upload', () => {
        it('should upload questions from a JSON file', async () => {
            const questionsData = {
                questions: [
                    {
                        question_title: 'What is a tree?',
                        question_description: 'Explain the concept of a tree in data structures.',
                        question_categories: ['Data Structures'],
                        question_complexity: 'EASY',
                        question_popularity: 40,
                        question_examples: [
                            {
                                input: 'Binary Tree Example',
                                output: 'Tree Structure',
                                explanation: 'A tree consists of nodes connected by edges.'
                            }
                        ],
                    },
                    {
                        question_title: 'What is a graph?',
                        question_description: 'Explain the concept of a graph.',
                        question_categories: ['Data Structures'],
                        question_complexity: 'MEDIUM',
                        question_popularity: 60,
                    }
                ]
            };

            // Create a temporary file for testing
            const tempFilePath = path.join(__dirname, 'tempQuestions.json');
            fs.writeFileSync(tempFilePath, JSON.stringify(questionsData));

            const response = await request(app)
                .post('/questions/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', tempFilePath); // Attach the JSON file

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Questions uploaded successfully');

            // Clean up the temporary file
            fs.unlinkSync(tempFilePath);
        });

        it('should return 400 for missing file', async () => {
            const response = await request(app)
                .post('/questions/upload')
                .set('Authorization', `Bearer ${token}`)
                .send(); // No file attached

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'No file uploaded');
        });
    });
});