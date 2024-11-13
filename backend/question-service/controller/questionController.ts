import { Request, Response } from 'express';
import Question from '../model/questionModel';
import fs from 'fs';

// Utility function to convert string to number
const toNumber = (id: string): number => parseInt(id, 10);

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const questionData = req.body;

        const maxIdQuestion = await Question.findOne({}, {}, { sort: { question_id: -1 } });
        const newQuestionId = maxIdQuestion ? maxIdQuestion.question_id + 1 : 1;

        const question = new Question({
            ...questionData,
            question_id: newQuestionId
        });
        
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
        const questionId = req.params.id;
        const question = await Question.findById(questionId);
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
        const deletedQuestion = await Question.findOneAndDelete({ question_id: questionId });
        
        if (deletedQuestion) {
            await Question.updateMany(
                { question_id: { $gt: questionId } },
                { $inc: { question_id: -1 } }
            );

            res.status(200).json({ message: 'Question deleted and IDs adjusted' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error deleting question by ID:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getQuestionCategories = async (req: Request, res: Response) => {
    try {
        const uniqueCategories = await Question.distinct('question_categories');
        res.json(uniqueCategories);
    } catch (error) {
        console.error('Error getting question categories', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getRandomQuestion = async (req: Request, res: Response) => {
    try {
        const { difficulty, category } = req.query;
        
        if (!difficulty || !category) {
            return res.status(400).json({ error: "Both difficulty and category must be provided" });
        }

        const randomQuestion = await Question.aggregate([
            {
                $match: {
                    question_complexity: difficulty,
                    question_categories: { $in: [category] }
                }
            },
            {
                $sample: { size: 1 }
            }
        ]);

        if (randomQuestion.length === 0) {
            return res.status(404).json({ message: 'No questions found for the given difficulty and category' });
        }

        res.status(200).json(randomQuestion[0]);
    } catch (error) {
        console.error('Error getting question categories', error);
        res.status(400).json({ error: (error as Error).message });
    }
}

export const uploadQuestions = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const jsonData = fs.readFileSync(req.file.path, 'utf-8');
        const questions = JSON.parse(jsonData);

        for (const questionData of questions.questions) {
            const maxIdQuestion = await Question.findOne({}, {}, { sort: { question_id: -1 } });
            const newQuestionId = maxIdQuestion ? maxIdQuestion.question_id + 1 : 1;

            const question = new Question({
                ...questionData,
                question_id: newQuestionId
            });
            await question.save();
        }

        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: 'Questions uploaded successfully', questions });
    } catch (error) {
        console.error('Error uploading the question with JSON file', error);
        res.status(400).json({ error: (error as Error).message });
    }
};