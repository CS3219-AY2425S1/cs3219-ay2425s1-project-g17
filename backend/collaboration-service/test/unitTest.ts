import { expect } from 'chai';
import sinon from 'sinon';
import * as collabController from '../controller/collabController';
import request from 'supertest';
import { generateToken } from '../utils/tokenGenerator.js';
import { app } from '../app';
import { redisClient } from '../redisClient'; 
import { v4 as uuidv4 } from 'uuid';

const token = generateToken('testuser');
let sessionId: string;

describe('Collaboration Service Unit Tests', () => {
    beforeEach(async () => {
        sessionId = uuidv4(); 
        await redisClient.hset(sessionId, "user1Id", '123');
    });
    afterEach(() => {
        sinon.restore();
    });
    describe('POST /collaboration', () => {
        it('should create a new collaboration session', async () => {
            sinon.stub(collabController, 'fetchRandomQuestion').returns(Promise.resolve({ question_id: "12345" }));
            sinon.stub(collabController, 'saveCollaborationRoom').returns(Promise.resolve("newSessionId"));

            const newCollaboration = {
                user1Id: '6728d49fd5156fbb9a177b00',
                user2Id: '6728d580d5156fbb9a177b1e',
                category: 'Algorithms',
                difficulty: 'EASY'
            };

            const response = await request(app)
                .post('/collaboration')
                .set('Authorization', `Bearer ${token}`)
                .send(newCollaboration);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('sessionId', 'newSessionId');
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteCollaboration = {
                user1Id: '6728d49fd5156fbb9a177b00',
                difficulty: "EASYX"
            };

            const response = await request(app)
                .post('/collaboration')
                .set('Authorization', `Bearer ${token}`)
                .send(incompleteCollaboration);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Error creating collaboration room');
        });
    });
    describe('POST /collaboration/disconnect', () => {    
        it('should successfully disconnect the user with a valid session ID', async () => {
            const disconnectResponse = await request(app)
                .post('/collaboration/disconnect')
                .set('Authorization', `Bearer ${token}`)
                .send({ sessionId: sessionId });
    
            expect(disconnectResponse.status).to.equal(200);
            expect(disconnectResponse.body).to.have.property('message', 'successfully disconnected');
        });
        it('should return 440 if sessionId is missing', async () => {
            const response = await request(app)
                .post('/collaboration/disconnect')
                .set('Authorization', `Bearer ${token}`)
                .send({}); 

            expect(response.status).to.equal(440);
            expect(response.body).to.equal('Session Expired');
        });
    });
    describe('POST /collaboration/cache', () => {
        it('should cache the code with valid request', async () => {
            const sessionId = 'session123';
            const code = 'console.log("Hello, World!");';
            const language = 'JavaScript';
            const newLanguage = 'Python';

            sinon.stub(redisClient, 'hset').resolves();

            const requestBody = {
                sessionId,
                code,
                language,
                newLanguage,
            };

            const response = await request(app)
                .post('/collaboration/cache')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'code cached');
        });

        it('should return 400 for missing required fields', async () => {
            const requestBody = {
                sessionId: 'session123',
                code: 'console.log("Hello, World!");'
            };

            const response = await request(app)
                .post('/collaboration/cache')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Error caching');
        });
    });
    describe('GET /collaboration/:id', () => {
        it('should return collaboration room data with valid user ID', async () => {
            const userId = "abcd";
            const mockSessionData = {
                user1Id: userId,
                user2Id: "efgh",
            };

            sinon.stub(collabController, 'getSessionData').returns(Promise.resolve({ sessionId: "12345", session: mockSessionData }));

            const response = await request(app)
                .get(`/collaboration/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
        });

        it('should return 404 if collaboration room is not found', async () => {
            const response = await request(app)
                .get(`/collaboration/nonexistent`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('error', 'Collaboration room not found');
        });
    });
});