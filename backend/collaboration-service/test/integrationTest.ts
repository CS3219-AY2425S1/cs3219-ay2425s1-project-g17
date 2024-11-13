import request from 'supertest';
import { expect } from 'chai';
import { app } from '../app';
import { generateToken } from '../utils/tokenGenerator.js';
import dotenv from 'dotenv';
import { redisClient } from '../redisClient'; 
import sinon from 'sinon';
import * as collabController from '../controller/collabController';

dotenv.config();

const token = generateToken('testuser');
const invalidToken = generateToken('invalidUsername');

const deleteSession = async (sessionId: string) => {
    const res = await request(app)
        .post('/collaboration/disconnect')
        .send({
            sessionId: sessionId
        })
        .set('Authorization', `Bearer ${token}`);
}

describe('Collaboration API Integration Test', () => {
    describe('POST /collaboration', () => {
        it('should return 201 and create a new collaboration session', async () => {
            sinon.stub(collabController, 'fetchRandomQuestion').returns(Promise.resolve({ question_id: "12345" }));
            const res = await request(app)
                .post('/collaboration')
                .send({
                    user1Id: '11111111',
                    user2Id: '22222222',
                    category: 'EASY',
                    difficulty: 'Array'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(201);
            deleteSession(res.body.sessionId);
        });

        it('should return 400 for missing required fields', async () => {
            const res = await request(app)
                .post('/collaboration')
                .send({
                    user2Id: '22222222',
                    category: 'EASYX',
                    difficulty: 'Array'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(400);
        });
    });

    describe('POST /collaboration/disconnect', () => {
        it('should return 200 and delete the collaboration session', async () => {
            const sessionId = "testSession";
            await redisClient.hset(sessionId, "user1Id", '11111111');

            const res = await request(app)
                .post('/collaboration/disconnect')
                .send({
                    sessionId: sessionId
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'successfully disconnected');
            deleteSession(sessionId);
        });

        it('should return 440 for missing required fields', async () => {
            const res = await request(app)
                .post('/collaboration/disconnect')
                .send({
                    sessionId: ''
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(440);
        });
    });

    describe('POST /collaboration/cache', () => {
        it('should return 200 and cache the message', async () => {
            const sessionId = "testSession";
            await redisClient.hset(sessionId, "user1Id", '11111111');

            const res = await request(app)
                .post('/collaboration/cache')
                .send({
                    sessionId: sessionId,
                    code: 'print(hello world)',
                    language: 'javascript',
                    newLanguage: 'javascript'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'code cached');
            deleteSession(sessionId);
        });
        it('should return 400 for invalid fields', async () => {
            const res = await request(app)
                .post('/collaboration/cache')
                .send({
                    sessionId: ''
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(400);
        });
    });

    describe('GET /collaboration/:id', () => {
        it('should return 200 and the session data', async () => {
            const res_collab = await request(app)
                .post('/collaboration')
                .send({
                    user1Id: '11111111',
                    user2Id: '22222222',
                    category: 'EASY',
                    difficulty: 'Array'
                })
                .set('Authorization', `Bearer ${token}`);

            const res = await request(app)
                .get(`/collaboration/11111111`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            deleteSession(res_collab.body.sessionId);
        });

        it('should return 404 if collaboration room not found', async () => {
            const res = await request(app)
                .get('/collaboration/invalidSessionId')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res.status).to.equal(404);
        });
    });

    describe('GET /collaboration/shuffle/:id', () => {
        it('should return 200 and the new question id', async () => {
            const res_collab = await request(app)
                .post('/collaboration')
                .send({
                    user1Id: '11111111',
                    user2Id: '22222222',
                    category: 'EASY',
                    difficulty: 'Array'
                })
                .set('Authorization', `Bearer ${token}`);

            const res = await request(app)
                .get(`/collaboration/shuffle/11111111`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            deleteSession(res_collab.body.sessionId);
        });

        it('should return 404 if collaboration room not found', async () => {
            const res = await request(app)
                .get('/collaboration/shuffle/invalidSessionId')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res.status).to.equal(440);
        });
    });
});