import {
    getHistory,
    createHistory,
    getQuestionCount,
    formatHistoryResponse,
    formatQuestionCountResponse
} from '../controller/historyController';
import { HistoryModel, QuestionCountModel } from '../model/historyModel';
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';

describe('History Controller Unit Tests', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusStub: sinon.SinonStub;
    let jsonStub: sinon.SinonStub;

    beforeEach(() => {
        req = {
            body: {
                userId: 'user1',
                partnerId: 'partner1',
                questionId: 'question1',
                startTime: new Date(),
                attempt: 'attempt1'
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        statusStub = res.status as sinon.SinonStub;
        jsonStub = res.json as sinon.SinonStub;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getHistory', () => {
        it('should return history for a user', async () => {
            const mockHistory = [{
                userId: '1',
                partnerId: '2',
                questionId: '3',
                startTime: new Date(),
                endTime: new Date(),
                attempt: '1'
            }];
            sinon.stub(HistoryModel, 'find').resolves(mockHistory);

            req.params = { id: '1' };

            await getHistory(req as Request, res as Response);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonStub.calledWith({
                message: 'Found history',
                data: mockHistory.map(formatHistoryResponse)
            })).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(HistoryModel, 'find').throws(new Error('Database error'));

            req.params = { id: '1' };

            await getHistory(req as Request, res as Response);

            expect(statusStub.calledWith(500)).to.be.true;
            expect(jsonStub.calledWith({
                message: 'Unknown error when fetching history for user!',
                error: 'Database error'
            })).to.be.true;
        });
    });

    describe('createHistory', () => {
        it('should create a new history and update question count', async () => {
            const saveStub = sinon.stub(HistoryModel.prototype, 'save').resolves(req.body);
            const findOneStub = sinon.stub(QuestionCountModel, 'findOne').resolves(null);
            const saveQuestionCountStub = sinon.stub(QuestionCountModel.prototype, 'save').resolves();

            await createHistory(req as Request, res as Response);

            expect(saveStub.calledOnce).to.be.true;
            expect(findOneStub.calledOnce).to.be.true;
            expect(saveQuestionCountStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonStub.calledWithMatch({
                message: 'Created new attempt history successfully',
                data: req.body
            })).to.be.true;
        });

        it('should update question count if it already exists', async () => {
            const saveStub = sinon.stub(HistoryModel.prototype, 'save').resolves(req.body);
            const findOneStub = sinon.stub(QuestionCountModel, 'findOne').resolves({ question_id: 'question1', question_count: 1 });
            const findOneAndUpdateStub = sinon.stub(QuestionCountModel, 'findOneAndUpdate').resolves();

            await createHistory(req as Request, res as Response);

            expect(saveStub.calledOnce).to.be.true;
            expect(findOneStub.calledOnce).to.be.true;
            expect(findOneAndUpdateStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonStub.calledWithMatch({
                message: 'Created new attempt history successfully',
                data: req.body
            })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            sinon.stub(HistoryModel.prototype, 'save').throws(error);

            await createHistory(req as Request, res as Response);

            expect(statusStub.calledWith(500)).to.be.true;
            expect(jsonStub.calledWithMatch({
                message: 'Unknown error when creating history!',
                error: error.message
            })).to.be.true;
        });
    });

    describe('getQuestionCount', () => {
        it('should return question count', async () => {
            const mockQuestionCount = [{ question_id: '1', question_count: 5 }];
            sinon.stub(QuestionCountModel, 'find').resolves(mockQuestionCount);

            await getQuestionCount(req as Request, res as Response);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonStub.calledWith(mockQuestionCount.map(formatQuestionCountResponse))).to.be.true;
        });

        it('should handle errors', async () => {
            sinon.stub(QuestionCountModel, 'find').throws(new Error('Database error'));

            await getQuestionCount(req as Request, res as Response);

            expect(statusStub.calledWith(500)).to.be.true;
            expect(jsonStub.calledWith({
                message: 'Unknown error when fetching question count!',
                error: 'Database error'
            })).to.be.true;
        });
    });
});