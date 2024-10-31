import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import { app } from '../app';
import Question from '../model/questionModel';
import { generateToken } from '../utils/tokenGenerator';

const token = generateToken('tester123');

const mockQuestions = [
    {
        question_id: '111111111',
        question_title: 'What is an array?',
        question_description: 'Explain the concept of an array in programming.',
        question_categories: ['Data Structures'],
        question_complexity: 'EASY',
        question_popularity: 60,
    },
    {
        id: '222222222',
        question_id: 2,
        question_title: 'What is a linked list?',
        question_description: 'Explain the concept of a linked list in programming.',
        question_categories: ['Data Structures'],
        question_complexity: 'MEDIUM',
        question_popularity: 80,
    },
];

afterEach(() => {
    sinon.restore();
});

describe('Question Service Unit Tests', () => {
    describe('POST /questions', () => {
        it('should create a new question', async () => {
            sinon.stub(Question.prototype, 'save').resolves(mockQuestions[0]);
            sinon.stub(Question, 'findOne').resolves(mockQuestions[1]);

            const newQuestion = {
                question_title: 'What is the time complexity of binary search?',
                question_description: 'Explain the time complexity of binary search.',
                question_categories: ['Algorithms'],
                question_complexity: 'EASY',
                question_popularity: 100,
            };

            const response = await request(app)
                .post('/questions')
                .set('Authorization', `Bearer ${token}`)
                .send(newQuestion);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('question_id', 3);
        });

        it('should return 400 for missing required fields', async () => {
            sinon.stub(Question, 'findOne').resolves(mockQuestions[1]);

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

    describe('GET /questions', () => {
        it('should get all questions', async () => {
            sinon.stub(Question, 'find').resolves(mockQuestions);

            const response = await request(app)
                .get('/questions')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array').that.has.lengthOf(mockQuestions.length);
        });

        it('should return 401 for unauthorized access', async () => {
            const response = await request(app).get('/questions');
            expect(response.status).to.equal(401);
        });
    });

    describe('GET /questions/:id', () => {
        it('should get a question by its ID', async () => {
            sinon.stub(Question, 'findOne').resolves(mockQuestions[0]);

            const response = await request(app)
                .get(`/questions/${mockQuestions[0].question_id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', mockQuestions[0].question_id);
        });

        it('should return 404 if the question does not exist', async () => {
            sinon.stub(Question, 'findOne').resolves(null);

            const response = await request(app)
                .get(`/questions/999`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('PUT /questions/:id', () => {
        it('should update a question by its ID', async () => {
            sinon.stub(Question, 'findOneAndUpdate').resolves(mockQuestions[0]);

            const updatedQuestion = {
                question_title: 'Updated Question Title',
                question_description: 'Updated description.',
            };

            const response = await request(app)
                .put(`/questions/${mockQuestions[0].question_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedQuestion);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', mockQuestions[0].question_id);
        });

        it('should return 404 if the question to update does not exist', async () => {
            sinon.stub(Question, 'findOneAndUpdate').resolves(null);

            const updatedQuestion = {
                question_title: 'Non-existent question update',
            };

            const response = await request(app)
                .put(`/questions/999`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedQuestion);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('DELETE /questions/:id', () => {
        it('should delete a question by its ID', async () => {
            sinon.stub(Question, 'findOneAndDelete').resolves(mockQuestions[0]);
            sinon.stub(Question, 'updateMany').resolves();

            const response = await request(app)
                .delete(`/questions/${mockQuestions[0].question_id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'Question deleted and IDs adjusted');
        });

        it('should return 404 if the question to delete does not exist', async () => {
            sinon.stub(Question, 'findOneAndDelete').resolves(null);

            const response = await request(app)
                .delete(`/questions/999`) // ID that doesn't exist
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Question not found');
        });
    });

    describe('GET /questions/categories', () => {
        it('should get unique question categories', async () => {
            const categories = ['Data Structures', 'Algorithms'];
            sinon.stub(Question, 'distinct').resolves(categories);

            const response = await request(app)
                .get('/questions/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.include.members(categories);
        });

        it('should return 400 if there is an error fetching categories', async () => {
            sinon.stub(Question, 'distinct').throws(new Error('Database error'));

            const response = await request(app)
                .get('/questions/categories')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
        });
    });

    describe('GET /questions/random', () => {
        it('should get a random question', async () => {
            sinon.stub(Question, 'aggregate').resolves([mockQuestions[0]]);

            const response = await request(app)
                .get('/questions/random?difficulty=EASY&category=Data Structures')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('question_id', 1);
        });

        it('should return 400 if difficulty or category is missing', async () => {
            const response = await request(app)
                .get('/questions/random') // Missing parameters
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Both difficulty and category must be provided');
        });
    });

    describe('POST /questions/upload', () => {
        it('should return 400 if no file is uploaded', async () => {
            const response = await request(app)
                .post('/questions/upload')
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'No file uploaded');
        });
    });
});
