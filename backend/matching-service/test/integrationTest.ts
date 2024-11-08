import request from 'supertest';
import { expect } from 'chai';
import { app } from '../app';
import { generateToken } from '../utils/tokenGenerator';
import sinon from 'sinon';
import { redisClient } from '../redisClient';
import dotenv from 'dotenv';
import { DIFFICULTY } from '../model/matchModel';

dotenv.config();

const token = generateToken('tester123');
const invalidToken = generateToken('invalidUsername');
const mockRequests = {
    validRequest: {
        username: 'tester123',
        userId: '11111111',
        category: 'Algorithms',
        difficulty: DIFFICULTY.EASY, 
    },
    invalidRequest: {
        username: 'tester123',
        userId: '22222222',
        category: 'Algorithms',
        difficulty: 'INVALID', 
    },
    incompleteRequest: {
        username: 'tester123',
        userId: '33333333',
        difficulty: DIFFICULTY.EASY, 
    },
};

afterEach(() => {
    sinon.restore();
});

describe('Matching Service Integration Tests', () => {

    describe('POST /matching/match-request', () => {
        it('should create a match request with valid data', async () => {
            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token}`)
                .send(mockRequests.validRequest);

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User added to queue');
        });

        it('should return 400 for invalid difficulty', async () => {
            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token}`)
                .send(mockRequests.invalidRequest);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('message', 'Invalid difficulty');
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token}`)
                .send(mockRequests.incompleteRequest);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message', 'Missing required fields: userId, username, category, and difficulty are required.');
        });
    });

    describe('GET /matching/check-match-status/:userId', () => {
        it('should return matched status if user is matched', async () => {
            await redisClient.hset(`match:${mockRequests.validRequest.userId}`, {
                username: 'tester123',
                userId: mockRequests.validRequest.userId,
                category: 'Algorithms',
                difficulty: 'easy',
                createdAt: '23123412412',
                isMatched: 'true',
                partnerId: '22222222',
                partnerUsername: 'tester234',
            });

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('matched', true);
            expect(response.body).to.have.property('partnerId', '22222222');


            await redisClient.del(`match:${mockRequests.validRequest.userId}`);
        });

        it('should return removed status if user is not in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves(undefined);
            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('removed', true);
        });

        it('should return not matched status if user is in queue but not matched', async () => {
            await redisClient.hset(`match:${mockRequests.validRequest.userId}`, { isMatched: 'false' });

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('matched', false);

            //await redisClient.del(`match:${mockRequests.validRequest.userId}`);
        });
    });

    describe('POST /matching/cancel-match-request', () => {
        it('should remove user from queue on valid cancellation', async () => {
            await redisClient.hset(`match:${mockRequests.validRequest.userId}`, { userId: mockRequests.validRequest.userId });

            const response = await request(app)
                .post('/matching/cancel-match-request')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User removed from queue');

            //await redisClient.del(`match:${mockRequests.validRequest.userId}`);
        });

        it('should return success if user is not found in queue', async () => {
            const response = await request(app)
                .post('/matching/cancel-match-request')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User does not exist in queue');
        });
    });

    describe('POST /matching/check-if-in-queue', () => {
        it('should return inQueue: true if user is in queue', async () => {
            await redisClient.hset(`match:${mockRequests.validRequest.userId}`, { userId: mockRequests.validRequest.userId });

            const response = await request(app)
                .post('/matching/check-if-in-queue')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('inQueue', true);

            await redisClient.del(`match:${mockRequests.validRequest.userId}`);
        });

        it('should return inQueue: false if user is not in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves(undefined);
            const response = await request(app)
                .post('/matching/check-if-in-queue')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mockRequests.invalidRequest.userId });

            
            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('inQueue', false);
        });
    });
});
