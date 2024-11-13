import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import { app } from '../app';
import { DIFFICULTY } from '../model/matchModel';
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

describe('Matching Service Unit Tests', () => {
    describe('POST /matching/match-request', () => {
        it('should create a match request with valid data', async () => {
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
        it('should return not matched status if user is in queue but not matched', async () => {
            

            const response = await request(app)
                .get(`/matching/check-match-status/${mockRequests.validRequest.userId}`)
                .set('Authorization', `Bearer ${token1}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('matched', false);
        });
    });

    describe('POST /matching/cancel-match-request', () => {
        it('should remove user from queue on valid cancellation', async () => {
   

            const response = await request(app)
                .post('/matching/cancel-match-request')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('success', true);
            expect(response.body).to.have.property('message', 'User removed from queue');
        });

        it('should return success if user is not found in queue', async () => {


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

            const response = await request(app)
                .post('/matching/check-if-in-queue')
                .set('Authorization', `Bearer ${token1}`)
                .send({ userId: mockRequests.validRequest.userId });

            expect(response.status).to.equal(202);
            expect(response.body).to.have.property('inQueue', true);
        });
    });
});
