import { Request, Response } from 'express';
import Question from '../model/questionModel';

// Utility function to convert string to number
const toNumber = (id: string): number => parseInt(id, 10);

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const questionData = req.body;
        const question = new Question(questionData);
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getQuestionById = async (req: Request, res: Response) => {
    try {
        const questionId = toNumber(req.params.id);
        const question = await Question.findOne({ question_id: questionId });
        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const updateQuestionById = async (req: Request, res: Response) => {
    try {
        const questionId = toNumber(req.params.id);
        const updatedQuestion = await Question.findOneAndUpdate(
            { question_id: questionId },
            req.body,
            { new: true }
        );
        if (updatedQuestion) {
            res.status(200).json(updatedQuestion);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error updating question by ID:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deleteQuestionById = async (req: Request, res: Response) => {
    try {
        const questionId = toNumber(req.params.id);
        const result = await Question.findOneAndDelete({ question_id: questionId });
        if (result) {
            res.status(200).json({ message: 'Question deleted' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error deleting question by ID:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};