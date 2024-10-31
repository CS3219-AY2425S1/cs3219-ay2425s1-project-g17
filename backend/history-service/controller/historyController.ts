import { Request, Response } from 'express';
import { HistoryModel, QuestionCountModel } from '../model/historyModel';

export const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const history = await HistoryModel.find({ userId: userId }, {}, { sort: { startTime: -1 } });
        res.status(200).json({
            message: 'Found history',
            data: history.map(formatHistoryResponse)
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            message: 'Unknown error when fetching history for user!',
            error: (error as Error).message
        });
    }
};

export const getQuestionCount = async (req: Request, res: Response) => {
    try {
        const questionCount = await QuestionCountModel.find();
        res.status(200).json(questionCount.map(formatQuestionCountResponse));
    } catch (error) {
        console.error('Error fetching question count:', error);
        res.status(500).json({
            message: 'Unknown error when fetching question count!',
            error: (error as Error).message
        });
    }
};

export const createHistory = async (req: Request, res: Response) => {
    try {
        const { userId, partnerId, questionId, startTime, attempt } = req.body;
        const history = new HistoryModel({ userId: userId, partnerId: partnerId, questionId: questionId, startTime: startTime, attempt: attempt });
        const createdHistory = await history.save();

        // Update Question Count
        const originalQuestionCount = await QuestionCountModel.findOne({ question_id: questionId });
        if (!originalQuestionCount) {
            const questionCount = new QuestionCountModel({ question_id: questionId, question_count: 1 });
            await questionCount.save();
        } else {
            const newQuestionCount = originalQuestionCount.question_count + 1;
            await QuestionCountModel.findOneAndUpdate(
                { question_id: questionId },
                { $set: { question_count: newQuestionCount } },
                { new: true },
            );
        }

        res.status(201).json({
            message: 'Created new attempt history successfully',
            data: formatHistoryResponse(createdHistory)
        });
    } catch (error) {
        console.error('Error creating history: ', error);
        res.status(500).json({
            message: 'Unknown error when creating history!',
            error: (error as Error).message
        });
    }
};

export const formatHistoryResponse = (history: { userId: String; partnerId: String; questionId: String; startTime: Date; endTime: Date; attempt: String; }) => {
    return {
        userId: history.userId,
        partnerId: history.partnerId,
        questionId: history.questionId,
        startTime: history.startTime,
        endTime: history.endTime,
        attempt: history.attempt,
    };
};

export const formatQuestionCountResponse = (questionCount: { question_id: String; question_count: Number; }) => {
    return {
        question_id: questionCount.question_id,
        question_count: questionCount.question_count,
    };
};