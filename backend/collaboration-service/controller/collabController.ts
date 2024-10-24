import { Request, Response } from 'express';
import fs from 'fs';

export const createCollaborationRoom = async (req: Request, res: Response) => {
    console.log(req);
    /*try {
        const user_1 = req.body.user_1;
        const user_2 = req.body.user_2;
        const category = req.body.category;
        const difficulty = req.body.difficulty;

        const maxIdQuestion = await Question.findOne({}, {}, { sort: { question_id: -1 } });
        const newQuestionId = maxIdQuestion ? maxIdQuestion.question_id + 1 : 1;

        const question = new Question({
            ...questionData,
            question_id: newQuestionId
        });
        
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating collaboration room:', error);
        res.status(400).json({ error: (error as Error).message });
    }*/
};