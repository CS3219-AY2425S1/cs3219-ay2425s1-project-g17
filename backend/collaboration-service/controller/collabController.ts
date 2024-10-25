import { Request, Response } from 'express';
import axios from 'axios';
import { generateToken } from "../utils/tokenGenerator"
import { redisClient } from "../redisClient"
import { v4 as uuidv4 } from 'uuid';

const fetchRandomQuestion = async (difficulty: string, category: string, token: string) => {
    try {
        // for docker
        const apiUrl = `http://question-service:4000/questions/random?difficulty=${difficulty}&category=${category}`;
        //const apiUrl = `http://localhost:4000/questions/random?difficulty=${difficulty}&category=${category}`;
        const headers = { 
            Authorization: `Bearer ${token}` 
        };
        const response = await axios.get(apiUrl, { headers });
        return response.data;
    } catch (error) {
        return error;
    }
};

const saveCollaborationRoom = async (user1Id: string, user2Id: string, questionId: any, category: string, difficulty: string) => {
    try {
        const sessionId = uuidv4(); 
        const sessionData = {
            user1Id,
            user2Id,
            questionId, 
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
        console.log(bearerToken);
        const questionRes = await fetchRandomQuestion(difficulty, category, bearerToken);
        console.log(questionRes);
        if (questionRes.question_id == null) {
            res.status(questionRes.status).json({ error: questionRes });
        } else {
            const sessionId = await saveCollaborationRoom(user1Id, user2Id, questionRes.question_id, category, difficulty);
            res.status(200).json(sessionId);
        }
    } catch (error) {
        console.error('Error creating collaboration room:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

const getParter = async (userId: string) => {
    try {
        const bearerToken = generateToken(userId);
        const apiUrl = `http://user-service:4001/users/${userId}`;
        const headers = { 
            Authorization: `Bearer ${bearerToken}` 
        };
        const response = await axios.get(apiUrl, { headers });
        return response.data.data;
    } catch (error) {
        return error;
    }
}

const getSessionData = async (userId: string) => {
    const sessions = await redisClient.keys('session:*'); 
    for (const key of sessions) {
        const sessionData = await redisClient.hgetall(key);
        if (sessionData.user1Id == userId) {
            const partner = await getParter(sessionData.user2Id);
            sessionData["partner"] = partner.username;
            sessionData["partner_pic"] = partner.profilePic;
            return { sessionId: key, session: sessionData };
        } else if (sessionData.user2Id == userId) {
            const partner =  await getParter(sessionData.user1Id);
            sessionData["partner"] = partner.username;
            sessionData["partner_pic"] = partner.profilePic;
            return { sessionId: key, session: sessionData };
        }
    }
}

export const getCollaborationRoom = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const sessionData = await getSessionData(userId)
    console.log(sessionData);
    res.status(200).json(sessionData);
}

export const shuffleQuestion = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const sessionData = await getSessionData(userId);
    const sessionId = sessionData?.sessionId;

    if (!sessionId) {
        res.status(440).json("Session Expired")
        return
    }

    let newQuestionId = sessionData?.session.questionId;
    let newQuestion;

    const questionId = sessionData?.session.questionId;
    const category = sessionData?.session.category || "Algorithms";
    const difficulty = sessionData?.session.difficulty || "EASY";
    const bearerToken = generateToken(userId);

    while (newQuestionId == questionId) {
        newQuestion = await fetchRandomQuestion(difficulty, category, bearerToken);
        newQuestionId = newQuestion.question_id;
    }

    await redisClient.hset(sessionId, 'questionId', newQuestionId);
    res.status(200).json({"question_id": newQuestionId});
}


export const disconnectUser = async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const sessionData = await getSessionData(userId);
        const sessionId = sessionData?.sessionId;

        if (!sessionId) {
            res.status(440).json("Session Expired")
            return
        }

        if (sessionData?.session.user1Id == userId) {
            // Check if other user have already been disconnected
            if (sessionData?.session.user2Id == "") {
                await redisClient.del(sessionId);
            } else {
                await redisClient.hset(sessionId, 'user1Id', "");
            }
        } else if (sessionData?.session.user2Id == userId) {
            if (sessionData?.session.user1Id == "") {
                await redisClient.del(sessionId);
            } else {
                await redisClient.hset(sessionId, 'user2Id', ""); 
            }
        }

        res.status(200).json({"message": "successfully disconnected"});
    } catch (error) {
        console.error('Error disconnecting', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const submitAttempt = async (req: Request, res: Response) => {
    try {
        const sessionId = req.body.sessionId;
        await redisClient.del(sessionId);
        res.status(200).json({"message": "successfully disconnected"});
    } catch (error) {
        console.error('Error submitting', error);
        res.status(400).json({ error: (error as Error).message });
    }
};
