import { expect } from 'chai';
import sinon from 'sinon';
import * as collabController from '../controller/collabController';
import request from 'supertest';
import { app } from '../app';
import { generateToken } from '../utils/tokenGenerator.js';

const token = generateToken('testuser');
const userId = '11111111';
const sessionId = '44444444';

const mockSession =
    {
        user1Id: userId,
        user2Id: '2222222',
        category: 'Array',
        difficulty: 'EASY',
    }

const invalidSession = 
    {
        user1Id: userId,
        difficulty: "EASYX"
    }

const mockSessionData = 
    {
        sessionId: '44444444', 
        session: mockSession
    }

const mockCache = 
    {
        sessionId: sessionId,
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        newLanguage: 'python'
    }

describe('Collaboration Service Unit Tests', () => {

    beforeEach(() => {
        sinon.stub(collabController, 'fetchRandomQuestion').resolves({ question_id: "33333333" });
        sinon.stub(collabController, 'saveCollaborationRoom').returns(Promise.resolve(sessionId));
        sinon.stub(collabController, 'getSessionData').resolves(mockSessionData);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /collaboration', () => {
        it('should successfully create a collaboration room', async () => {
            const response = await request(app)
                .post('/collaboration')
                .send(mockSession)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).to.equal(201);
            expect(response.body.sessionId).to.equal(sessionId);
        });
        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/collaboration')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidSession);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Error creating collaboration room');
        });
    });

    describe('POST /collaboration/disconnect', () => {
        it('should successfully disconnect the user', async () => {
            const disconnectResponse = await request(app)
                .post('/collaboration/disconnect')
                .set('Authorization', `Bearer ${token}`)
                .send({ sessionId });

            expect(disconnectResponse.status).to.equal(200);
            expect(disconnectResponse.body).to.have.property('message', 'successfully disconnected');
        });

        it('should return 440 if missing sessionId', async () => {
            const response = await request(app)
                .post('/collaboration/disconnect')
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(response.status).to.equal(440);
            expect(response.body).to.equal('Session Expired');
        });
    });

    describe('GET /collaboration/:id', () => {
        it('should retrieve a collaboration room session data', async () => {
            const response = await request(app)
                .get(`/collaboration/${userId}`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).to.equal(200);
            expect(response.body.session).to.have.property('user1Id', userId);
            expect(response.body.session).to.have.property('user2Id', '2222222');
        });

        it('should return 404 if session not found', async () => {
            const response = await request(app)
                .get(`/collaboration/`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).to.equal(404);
        });
    });

    describe('POST /collaboration/cache', () => {
        it('should cache the code with valid request', async () => {
            const response = await request(app)
                .post('/collaboration/cache')
                .set('Authorization', `Bearer ${token}`)
                .send(mockCache);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', 'code cached');
        });

        it('should return 400 for missing required fields', async () => {
            const requestBody = {
                sessionId: sessionId,
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
});
