import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import { generateToken } from "../utils/tokenGenerator"
import { redisClient } from "../redisClient"
import { v4 as uuidv4 } from 'uuid';

const fetchRandomQuestion = async (difficulty: string, category: string, token: string) => {
    try {
        const apiUrl = `http://localhost:4000/questions/random?difficulty=${difficulty}&category=${category}`;
        const headers = { 
            Authorization: `Bearer ${token}` 
        };
        const response = await axios.get(apiUrl, { headers });
        return response.data;
    } catch (error) {
        return error;
    }
};

const saveCollaborationRoom = async (user1Id: string, user2Id: string, question: any, category: string, difficulty: string) => {
    try {
        const sessionId = uuidv4(); 
        const sessionData = {
            user1Id,
            user2Id,
            question, 
            category,
            difficulty
        };

        await redisClient.hset(`session:${sessionId}`, sessionData);
        console.log('Session saved to Redis:', sessionId);
        return sessionId;
    } catch (error) {
        return error;
    }
}

export const createCollaborationRoom = async (req: Request, res: Response) => {
    try {
        const user1Id = req.body.user1Id;
        const user2Id = req.body.user2Id;
        const category = req.body.category;
        const difficulty = req.body.difficulty;

        const bearerToken = generateToken(user1Id);
        const questionRes = await fetchRandomQuestion(difficulty, category, bearerToken);

        if (questionRes.question_id == null) {
            res.status(questionRes.status).json({
                error: questionRes 
            });
        } else {
            const sessionId = await saveCollaborationRoom(user1Id, user2Id, questionRes, category, difficulty);
            res.status(200).json({ 
                message: "success",
                sessionId: sessionId
            });
        }
    } catch (error) {
        console.error('Error creating collaboration room:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};
