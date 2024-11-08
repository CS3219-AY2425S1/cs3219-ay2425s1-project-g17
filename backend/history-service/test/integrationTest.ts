import request from 'supertest';
import mongoose from 'mongoose';
import { app, connectToMongoDB } from '../app';
import { HistoryModel, QuestionCountModel } from '../model/historyModel';
import dotenv from 'dotenv';
import { generateToken } from '../utils/tokenGenerator';
import { expect } from 'chai';
import sinon from 'sinon';

dotenv.config();

describe('History API Integration Tests', () => {
    const mockUserId = 'user123';
    const mockPartnerId = 'partner456';
    const mockQuestionId = 'question789';
    const mockToken = generateToken('valid-jwt-token');

    before(async () => {
        const testUri = process.env.MONGO_URI_TEST || '';
        connectToMongoDB(testUri, "TEST");
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await HistoryModel.deleteMany({});
        await QuestionCountModel.deleteMany({});
    });

    afterEach(async () => {
        await HistoryModel.deleteMany({});
        await QuestionCountModel.deleteMany({});
    });

    describe('History Endpoints', () => {
        describe('GET /history/:id', () => {
            it('should return empty array when no history exists', async () => {
                const response = await request(app)
                    .get(`/history/${mockUserId}`)
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(200);
                expect(response.body.data).to.deep.equal([]);
            });

            it('should return user history sorted by startTime', async () => {
                const histories = [
                    {
                        userId: mockUserId,
                        partnerId: mockPartnerId,
                        questionId: mockQuestionId,
                        startTime: new Date('2024-01-01'),
                        attempt: 'attempt1'
                    },
                    {
                        userId: mockUserId,
                        partnerId: mockPartnerId,
                        questionId: mockQuestionId,
                        startTime: new Date('2024-01-02'),
                        attempt: 'attempt2'
                    }
                ];

                await HistoryModel.insertMany(histories);

                const response = await request(app)
                    .get(`/history/${mockUserId}`)
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(200);
                expect(response.body.data).to.have.lengthOf(2);
                expect(new Date(response.body.data[0].startTime)).to.be.greaterThan(new Date(response.body.data[1].startTime));
            });

            it('should only return history for requested user', async () => {
                const histories = [
                    {
                        userId: mockUserId,
                        partnerId: mockPartnerId,
                        questionId: mockQuestionId,
                        startTime: new Date(),
                        attempt: 'attempt1'
                    },
                    {
                        userId: 'otherUser',
                        partnerId: mockPartnerId,
                        questionId: mockQuestionId,
                        startTime: new Date(),
                        attempt: 'attempt2'
                    }
                ];

                await HistoryModel.insertMany(histories);

                const response = await request(app)
                    .get(`/history/${mockUserId}`)
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(200);
                expect(response.body.data).to.have.lengthOf(1);
                expect(response.body.data[0].userId).to.equal(mockUserId);
            });

            it('should return 401 for invalid token', async () => {
                const response = await request(app)
                    .get(`/history/${mockUserId}`)
                    .set('Authorization', 'Bearer invalid-token');

                expect(response.status).to.equal(401);
            });

            it('should return 500 for database error', async () => {
                sinon.stub(HistoryModel, 'find').rejects(new Error('Database error'));

                const response = await request(app)
                    .get(`/history/${mockUserId}`)
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(500);
                expect(response.body).to.have.property('error');
            });
        });

        describe('POST /history', () => {
            it('should create new history entry', async () => {
                const newHistory = {
                    userId: mockUserId,
                    partnerId: mockPartnerId,
                    questionId: mockQuestionId,
                    startTime: new Date(),
                    attempt: 'attempt1'
                };

                const response = await request(app)
                    .post('/history')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send(newHistory);

                expect(response.status).to.equal(201);
                expect(response.body.data).to.deep.include({
                    userId: mockUserId,
                    partnerId: mockPartnerId,
                    questionId: mockQuestionId,
                    attempt: 'attempt1'
                });

                const savedHistory = await HistoryModel.findOne({ userId: mockUserId });
                expect(savedHistory).to.be.ok;
            });

            it('should create question count for new question', async () => {
                const newHistory = {
                    userId: mockUserId,
                    partnerId: mockPartnerId,
                    questionId: mockQuestionId,
                    startTime: new Date(),
                    attempt: 'attempt1'
                };

                await request(app)
                    .post('/history')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send(newHistory);

                const questionCount = await QuestionCountModel.findOne({ question_id: mockQuestionId });
                expect(questionCount?.question_count).to.equal(1);
            });

            it('should increment existing question count', async () => {
                await QuestionCountModel.create({
                    question_id: mockQuestionId,
                    question_count: 5
                });

                const newHistory = {
                    userId: mockUserId,
                    partnerId: mockPartnerId,
                    questionId: mockQuestionId,
                    startTime: new Date(),
                    attempt: 'attempt1'
                };

                await request(app)
                    .post('/history')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send(newHistory);

                const questionCount = await QuestionCountModel.findOne({ question_id: mockQuestionId });
                expect(questionCount?.question_count).to.equal(6);
            });

            it('should return 500 for missing required fields', async () => {
                const invalidHistory = {
                    userId: mockUserId,
                    // missing partnerId
                    questionId: mockQuestionId,
                    startTime: new Date()
                };

                const response = await request(app)
                    .post('/history')
                    .set('Authorization', `Bearer ${mockToken}`)
                    .send(invalidHistory);

                expect(response.status).to.equal(500);
            });
        });
    });

    describe('Question Count Endpoints', () => {
        describe('GET /questioncount', () => {
            it('should return empty array when no question counts exist', async () => {
                const response = await request(app)
                    .get('/questioncount')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(200);
                expect(response.body).to.deep.equal([]);
            });

            it('should return all question counts', async () => {
                const questionCounts = [
                    { question_id: 'q1', question_count: 5 },
                    { question_id: 'q2', question_count: 10 }
                ];

                await QuestionCountModel.insertMany(questionCounts);

                const response = await request(app)
                    .get('/questioncount')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(200);
                expect(response.body).to.have.lengthOf(2);
                expect(response.body[0]).to.have.property('question_count');
                expect(response.body[1]).to.have.property('question_id');
            });

            it('should return 401 for invalid token', async () => {
                const response = await request(app)
                    .get('/questioncount')
                    .set('Authorization', 'Bearer invalid-token');

                expect(response.status).to.equal(401);
            });

            it('should return 500 for database error', async () => {
                sinon.stub(QuestionCountModel, 'find').rejects(new Error('Database error'));

                const response = await request(app)
                    .get('/questioncount')
                    .set('Authorization', `Bearer ${mockToken}`);

                expect(response.status).to.equal(500);
                expect(response.body).to.have.property('error');
            });
        });
    });
});