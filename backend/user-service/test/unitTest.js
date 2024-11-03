import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import * as userController from '../controller/user-controller.js';
import { handleVerifyToken } from "../controller/auth-controller.js";
import { S3Client } from "@aws-sdk/client-s3";
import crypto from 'crypto';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Unit Tests', () => {
    describe("handleVerifyToken", () => {
        let req, res;

        beforeEach(() => {
            req = {
                user: { id: 1, email: "test@example.com" }
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
        });

        it("should return 200 and verified user if token is valid", async () => {
            await handleVerifyToken(req, res);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: "Token verified",
                data: req.user
            })).to.be.true;
        });

        it("should return 500 if an error occurs", async () => {
            req = null; // Simulate an error
            await handleVerifyToken(req, res);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
        });
    });
});

describe('User Controller Unit Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {},
            params: {},
            file: null
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createUser', () => {
        it('should return 400 if username, email, or password is missing', async () => {
            req.body = { username: 'testuser', email: '' };

            await userController.createUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'username and/or email and/or password are missing'))).to.be.true;
        });
    });

    describe('updateUser', () => {
        it('should return 400 if no field to update', async () => {
            req.params.id = '1';
            req.body = {};

            await userController.updateUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'No field to update: username and email and password are all missing!'))).to.be.true;
        });
    });

    describe('updateUserPrivilege', () => {
        it('should return 400 if isAdmin is missing', async () => {
            req.params.id = '1';
            req.body = {};

            await userController.updateUserPrivilege(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'isAdmin is missing!'))).to.be.true;
        });
    });

    describe('uploadProfilePicture', () => {
        it('should return 400 if no file provided', async () => {
            await userController.uploadProfilePicture(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'No file provided'))).to.be.true;
        });

        it('should return 500 on unknown error', async () => {
            req.file = { buffer: Buffer.from('file content'), mimetype: 'image/png' };
            req.body.userId = '1';
            sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('randombytes'));
            sandbox.stub(S3Client.prototype, 'send').throws(new Error('Unknown error'));

            await userController.uploadProfilePicture(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Failed to upload file'))).to.be.true;
        });
    });
});