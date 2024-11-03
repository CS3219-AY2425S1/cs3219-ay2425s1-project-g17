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
    //     it('should return all question counts', async () => {
    //         const mockQuestionCounts = [
    //             { question_id: 'q1', question_count: 5 },
    //             { question_id: 'q2', question_count: 10 }
    //         ];

    //         sinon.stub(QuestionCountModel, 'find').resolves(mockQuestionCounts);

    //         await getQuestionCount(mockRequest as Request, mockResponse as Response);

    //         expect(mockResponse.status.calledWith(200)).to.be.true;
    //         expect(mockResponse.json.calledWith(
    //             sinon.match.array.contains([
    //                 sinon.match.object.contains({
    //                     question_id: sinon.match.string,
    //                     question_count: sinon.match.number
    //                 })
    //             ])
    //         )).to.be.true;
    //     });

    //     it('should handle database errors', async () => {
    //         sinon.stub(QuestionCountModel, 'find').rejects(new Error('Database error'));

    //         await getQuestionCount(mockRequest as Request, mockResponse as Response);

    //         expect(mockResponse.status.calledWith(500)).to.be.true;
    //         expect(mockResponse.json.calledWith(
    //             sinon.match.object.contains({
    //                 message: 'Unknown error when fetching question count!'
    //             })
    //         )).to.be.true;
    //     });
    // });

    // describe('Formatter Functions', () => {
    //     describe('formatHistoryResponse', () => {
    //         it('should format history response correctly', () => {
    //             const mockHistory = {
    //                 userId: 'user123',
    //                 partnerId: 'partner456',
    //                 questionId: 'question789',
    //                 startTime: new Date('2024-01-01'),
    //                 endTime: new Date('2024-01-02'),
    //                 attempt: 'attempt1'
    //             };

    //             const formattedResponse = formatHistoryResponse(mockHistory);

    //             expect(formattedResponse).to.deep.equal({
    //                 userId: mockHistory.userId,
    //                 partnerId: mockHistory.partnerId,
    //                 questionId: mockHistory.questionId,
    //                 startTime: mockHistory.startTime,
    //                 endTime: mockHistory.endTime,
    //                 attempt: mockHistory.attempt
    //             });
    //         });

    //         it('should handle undefined end time', () => {
    //             const mockHistory = {
    //                 userId: 'user123',
    //                 partnerId: 'partner456',
    //                 questionId: 'question789',
    //                 startTime: new Date('2024-01-01'),
    //                 endTime: undefined,
    //                 attempt: 'attempt1'
    //             };

    //             const formattedResponse = formatHistoryResponse(mockHistory);

    //             expect(formattedResponse.endTime).to.be.undefined;
    //             expect(formattedResponse).to.deep.include({
    //                 userId: mockHistory.userId,
    //                 partnerId: mockHistory.partnerId,
    //                 questionId: mockHistory.questionId,
    //                 startTime: mockHistory.startTime,
    //                 attempt: mockHistory.attempt
    //             });
    //         });

    //         it('should preserve data types in formatted response', () => {
    //             const mockHistory = {
    //                 userId: 'user123',
    //                 partnerId: 'partner456',
    //                 questionId: 'question789',
    //                 startTime: new Date('2024-01-01'),
    //                 endTime: new Date('2024-01-02'),
    //                 attempt: 'attempt1'
    //             };

    //             const formattedResponse = formatHistoryResponse(mockHistory);

    //             expect(formattedResponse.startTime).to.be.instanceOf(Date);
    //             expect(formattedResponse.endTime).to.be.instanceOf(Date);
    //             expect(typeof formattedResponse.userId).to.equal('string');
    //             expect(typeof formattedResponse.attempt).to.equal('string');
    //         });
    //     });

    //     describe('formatQuestionCountResponse', () => {
    //         it('should format question count response correctly', () => {
    //             const mockQuestionCount = {
    //                 question_id: 'question123',
    //                 question_count: 5
    //             };

    //             const formattedResponse = formatQuestionCountResponse(mockQuestionCount);

    //             expect(formattedResponse).to.deep.equal({
    //                 question_id: mockQuestionCount.question_id,
    //                 question_count: mockQuestionCount.question_count
    //             });
    //         });

    //         it('should handle zero question count', () => {
    //             const mockQuestionCount = {
    //                 question_id: 'question123',
    //                 question_count: 0
    //             };

    //             const formattedResponse = formatQuestionCountResponse(mockQuestionCount);

    //             expect(formattedResponse.question_count).to.equal(0);
    //         });

    //         it('should preserve data types in formatted response', () => {
    //             const mockQuestionCount = {
    //                 question_id: 'question123',
    //                 question_count: 5
    //             };

    //             const formattedResponse = formatQuestionCountResponse(mockQuestionCount);

    //             expect(typeof formattedResponse.question_id).to.equal('string');
    //             expect(typeof formattedResponse.question_count).to.equal('number');
    //         });
    //     });
    // });

    // describe('Input Validation', () => {
    //     describe('createHistory', () => {
    //         it('should validate required fields', async () => {
    //             const invalidRequests = [
    //                 { partnerId: 'partner456', questionId: 'question789', startTime: new Date(), attempt: 'attempt1' }, // missing userId
    //                 { userId: 'user123', questionId: 'question789', startTime: new Date(), attempt: 'attempt1' }, // missing partnerId
    //                 { userId: 'user123', partnerId: 'partner456', startTime: new Date(), attempt: 'attempt1' }, // missing questionId
    //                 { userId: 'user123', partnerId: 'partner456', questionId: 'question789', attempt: 'attempt1' }, // missing startTime
    //                 { userId: 'user123', partnerId: 'partner456', questionId: 'question789', startTime: new Date() } // missing attempt
    //             ];

    //             for (const invalidRequest of invalidRequests) {
    //                 mockRequest = {
    //                     body: invalidRequest
    //                 };

    //                 await createHistory(mockRequest as Request, mockResponse as Response);

    //                 expect(mockResponse.status.calledWith(400)).to.be.true;
    //                 expect(mockResponse.json.calledWith(
    //                     sinon.match.object.contains({
    //                         message: sinon.match.string.contains('Missing required fields')
    //                     })
    //                 )).to.be.true;
    //             }
    //         });

    //         it('should validate date format for startTime', async () => {
    //             const invalidRequest = {
    //                 userId: 'user123',
    //                 partnerId: 'partner456',
    //                 questionId: 'question789',
    //                 startTime: 'invalid-date',
    //                 attempt: 'attempt1'
    //             };

    //             mockRequest = {
    //                 body: invalidRequest
    //             };

    //             await createHistory(mockRequest as Request, mockResponse as Response);

    //             expect(mockResponse.status.calledWith(400)).to.be.true;
    //             expect(mockResponse.json.calledWith(
    //                 sinon.match.object.contains({
    //                     message: sinon.match.string.contains('Invalid date format')
    //                 })
    //             )).to.be.true;
    //         });

    //         it('should validate string length limits', async () => {
    //             const longString = 'a'.repeat(1000);
    //             const invalidRequest = {
    //                 userId: longString,
    //                 partnerId: 'partner456',
    //                 questionId: 'question789',
    //                 startTime: new Date(),
    //                 attempt: 'attempt1'
    //             };

    //             mockRequest = {
    //                 body: invalidRequest
    //             };

    //             await createHistory(mockRequest as Request, mockResponse as Response);

    //             expect(mockResponse.status.calledWith(400)).to.be.true;
    //             expect(mockResponse.json.calledWith(
    //                 sinon.match.object.contains({
    //                     message: sinon.match.string.contains('Field exceeds maximum length')
    //                 })
    //             )).to.be.true;
    //         });
    //     });
    // });
});