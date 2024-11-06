import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import { app } from '../app';
import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient';
import { generateToken } from '../utils/tokenGenerator';

const token1 = generateToken('tester123');
const mockRequests = {
    validRequest: {
        username: 'tester123',
        userId: '11111111',
        category: 'Algorithms',
        difficulty: DIFFICULTY.EASY,
    },
    invalidRequest: {
        username: 'tester123',
        userId: '11111111',
        category: 'Algorithms',
        difficulty: 'INVALID', // Invalid difficulty for testing
    },
    incompleteRequest: {
        username: 'tester123',
        userId: '11111111',
        difficulty: DIFFICULTY.EASY, // Missing 'category'
    },
};

afterEach(() => {
    sinon.restore();
});

describe('Matching Service Unit Tests', () => {
    describe('POST /matching/match-request', () => {
        it('should create a match request with valid data', async () => {
            sinon.stub(redisClient, 'hset').resolves(1);

            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send(mockRequests.validRequest);

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User added to queue');
        });

        it('should return 400 for invalid difficulty', async () => {
            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send(mockRequests.invalidRequest);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('success', false);
            expect(response.body).to.have.property('message', 'Invalid difficulty');
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/matching/match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send(mockRequests.incompleteRequest);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message', 'Missing required fields: userId, username, category, and difficulty are required.');
        });
    });

    describe('GET /matching/check-match-status/:userId', () => {
        it('should return matched status if user is matched', async () => {
            sinon.stub(redisClient, 'hgetall').resolves({
                username: 'tester123',
                userId: mockRequests.validRequest.userId,
                category: 'Algorithms',
                difficulty: DIFFICULTY.EASY,
                createdAt: '23123412412',
                isMatched: 'true',
                partnerId: '22222222',
                partnerUsername: 'tester234',
                categoryAssigned: 'Algorithms',
                difficultyAssigned: DIFFICULTY.EASY,
            });
            sinon.stub(redisClient, 'del').resolves(1);

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token1}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('matched', true);
            expect(response.body).to.have.property('partnerId', '22222222');
        });

        it('should return removed status if user is not in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves(undefined);

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token1}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('removed', true);
        });

        it('should return not matched status if user is in queue but not matched', async () => {
            sinon.stub(redisClient, 'hgetall').resolves({
                isMatched: 'false',
            });

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token1}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('matched', false);
        });
    });

    describe('POST /matching/cancel-match-request', () => {
        it('should remove user from queue on valid cancellation', async () => {
            sinon.stub(redisClient, 'hgetall').resolves({ userId: mockRequests.validRequest.userId });
            sinon.stub(redisClient, 'keys').resolves([`match:${mockRequests.validRequest.userId}`]);
            sinon.stub(redisClient, 'del').resolves(1);

            const response = await request(app)
                .post('/matching/cancel-match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User removed from queue');
        });

        it('should return success if user is not found in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves(undefined);

            const response = await request(app)
                .post('/matching/cancel-match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User does not exist in queue');
        });
    });

    describe('POST /matching/check-if-in-queue', () => {
        it('should return inQueue: true if user is in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves({ userId: mockRequests.validRequest.userId });

            const response = await request(app)
                .post('/matching/check-if-in-queue')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('inQueue', true);
        });

        it('should return inQueue: false if user is not in queue', async () => {
            sinon.stub(redisClient, 'hgetall').resolves(undefined);

            const response = await request(app)
                .post('/matching/check-if-in-queue')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('inQueue', false);
        });
    });
});
