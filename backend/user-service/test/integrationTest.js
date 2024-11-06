import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../index.js';
import { generateToken } from '../utils/tokenGenerator.js';
import { connectToDB } from '../model/repository.js';
import userModel from '../model/user-model.js';
import dotenv from 'dotenv';

dotenv.config();

const token = generateToken('testuser');
const invalidToken = generateToken('invalidUsername');

before(async () => {
    const testUri = process.env.MONGO_URI_TEST || '';
    connectToDB(testUri, "TEST");
});

after(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await userModel.deleteMany({});
});

afterEach(async () => {
    await userModel.deleteMany({});
});

describe('User API Integration Test', () => {
    describe('POST /users', () => {
        it('should return 201 and create a new user', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    username: 'testuser',
                    email: 'example@email.com',
                    password: 'password123'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Created new user testuser successfully');
            expect(res.body.data).to.have.property('username', 'testuser');
            expect(res.body.data).to.have.property('email', 'example@email.com');
        });

        it('should return 400 for missing required fields', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    username: 'testuser'
                })
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(400);
        });
    });

    describe('GET /users/:id', () => {
        it('should return 200 and the user data', async () => {
            const user = await request(app)
                .post('/users')
                .send({
                    username: 'testuser',
                    email: 'example@email.com',
                    password: 'password123'
                })
                .set('Authorization', `Bearer ${token}`);

            const newToken = generateToken(user.body.data.id);

            const res = await request(app)
                .get(`/users/${user.body.data.id}`)
                .set('Authorization', `Bearer ${newToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property('username', 'testuser');
            expect(res.body.data).to.have.property('email', 'example@email.com');
        });

        it('should return 404 if user not found', async () => {
            const res = await request(app)
                .get('/invalidUsername/invalidUserId')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(res.status).to.equal(404);
        });
    });

    describe('PATCH /users/:id', () => {
        it('should return 200 and update the user data', async () => {
            const user = await request(app)
                .post('/users')
                .send({
                    username: 'testuser',
                    email: 'example@email.com',
                    password: 'password123'
                })
                .set('Authorization', `Bearer ${token}`);

            const newToken = generateToken(user.body.data.id);

            const res = await request(app)
                .patch(`/users/${user.body.data.id}`)
                .send({
                    username: 'updateduser'
                })
                .set('Authorization', `Bearer ${newToken}`);

            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property('username', 'updateduser');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should return 200 and delete the user', async () => {
            const user = await request(app)
                .post('/users')
                .send({
                    username: 'testuser',
                    email: 'example@email.com',
                    password: 'password123'
                })
                .set('Authorization', `Bearer ${token}`);

            const newToken = generateToken(user.body.data.id);

            const res = await request(app)
                .delete(`/users/${user.body.data.id}`)
                .set('Authorization', `Bearer ${newToken}`);

            expect(res.status).to.equal(200);
        });
    });
});