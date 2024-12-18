import { Request, Response } from 'express';
import axios from 'axios';
import { generateToken } from "../utils/tokenGenerator"
import { redisClient } from "../redisClient"
import { v4 as uuidv4 } from 'uuid';
import * as Y from "yjs";
import dotenv from 'dotenv';

dotenv.config();

export const fetchRandomQuestion = async (difficulty: string, category: string, token: string) => {
    try {
        const apiUrl = (process.env.AWS_ELB_URI ?? "http://question-service") + `:4000/questions/random?difficulty=${difficulty}&category=${category}`;
        const headers = { 
            Authorization: `Bearer ${token}` 
        };
        const response = await axios.get(apiUrl, { headers });
        return response.data;
    } catch (error) {
        return error;
    }
};

const createDefaultYJSDoc = async () => {
    const defaultJsCode = `function solution() {\n\t// your code here\n}\n\nfunction main() {\n\tsolution();\n}\n\nmain();`;
    const defaultTextName = "monaco";

    const templateDocument = new Y.Doc();
    const templateText = templateDocument.getText(defaultTextName);
    templateText.insert(0, defaultJsCode);
    const buffer = Buffer.from(Y.encodeStateAsUpdate(templateDocument));
    const base64 = buffer.toString("base64");
    return base64;
}

export const saveCollaborationRoom = async (user1Id: string, user2Id: string, questionId: any, category: string, difficulty: string) => {
    try {
        const sessionId = uuidv4(); 
        const startTime: Date = new Date(); 
        const currLanguage: string = "javascript";
        const javascript: string = "";
        const template: string = await createDefaultYJSDoc();

        const sessionData = {
            user1Id,
            user2Id,
            questionId, 
            category,
            difficulty,
            currLanguage,
            javascript,
            startTime,
            template
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

        if (user1Id === undefined || user2Id === undefined || category === undefined || difficulty === undefined) {
            res.status(400).json({ error: "Error creating collaboration room" });
            return;
        }

        const bearerToken = generateToken(user1Id);
        const questionRes = await fetchRandomQuestion(difficulty, category, bearerToken);
        if (questionRes.question_id == null) {
            res.status(questionRes.status).json({ error: questionRes });
        } else {
            const sessionId = await saveCollaborationRoom(user1Id, user2Id, questionRes._id, category, difficulty);
            res.status(201).json({ sessionId });
        }
    } catch (error) {
        console.error('Error creating collaboration room:', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

const getParter = async (userId: string) => {
    try {
        const bearerToken = generateToken(userId);
        const apiUrl = (process.env.AWS_ELB_URI ?? "http://user-service") + `:4001/users/${userId}`;
        const headers = { 
            Authorization: `Bearer ${bearerToken}` 
        };
        const response = await axios.get(apiUrl, { headers });
        return response.data.data;
    } catch (error) {
        return error;
    }
}

export const getSessionData = async (userId: string) => {
    const sessions = await redisClient.keys('session:*'); 
    for (const key of sessions) {
        const sessionData = await redisClient.hgetall(key);
        if (sessionData.user1Id == userId) {
            const partner = await getParter(sessionData.user2Id);
            sessionData["partner"] = partner.username;
            sessionData["partner_pic"] = partner.profilePic;
            sessionData["partnerId"] = sessionData.user2Id;
            return { sessionId: key, session: sessionData };
        } else if (sessionData.user2Id == userId) {
            const partner =  await getParter(sessionData.user1Id);
            sessionData["partner"] = partner.username;
            sessionData["partner_pic"] = partner.profilePic;
            sessionData["partnerId"] = sessionData.user1Id;
            return { sessionId: key, session: sessionData };
        }
    }
}

export const getCollaborationRoom = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const sessionData = await getSessionData(userId)

        if (sessionData === undefined) {
            res.status(404).json({ error: "Collaboration room not found" });
            return;
        }
        res.status(200).json(sessionData);
    } catch (error) {
        console.error('Error getting collaboration room', error);
        res.status(404).json({ error: (error as Error).message });
    }
}

export const shuffleQuestion = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const sessionData = await getSessionData(userId);
        const sessionId = sessionData?.sessionId;

        if (!sessionId) {
            res.status(440).json("Session Expired")
            return
        }
        
        const category = sessionData?.session.category || "Algorithms";
        const difficulty = sessionData?.session.difficulty || "EASY";
        const bearerToken = generateToken(userId);

        const newQuestion = await fetchRandomQuestion(difficulty, category, bearerToken);

        await redisClient.hset(sessionId, 'questionId', newQuestion._id);
        res.status(200).json({"question_id": newQuestion._id});
    } catch (error) {
        console.error('Error shuffling question', error);
        res.status(400).json({ error: (error as Error).message });
    }
}

export const disconnectUser = async (req: Request, res: Response) => {
    try {
        const sessionId = req.body.sessionId;
        if (!sessionId) {
            res.status(440).json("Session Expired")
            return
        }
        await redisClient.del(sessionId);
        res.status(200).json({"message": "successfully disconnected"});
    } catch (error) {
        console.error('Error disconnecting', error);
        res.status(400).json({ error: (error as Error).message });
    }
};

export const getCacheCode = async (req: Request, res: Response) => {
    try {
        const sessionId = req.params.id;
        let language = req.params.language;
        const sessionData = await redisClient.hgetall(sessionId);
        if (language == "noLanguage") {
            language = sessionData["currLanguage"];
        }
        res.status(200).json({"code": sessionData[language], "currLanguage": sessionData["currLanguage"]});
    } catch (error) {
        console.error('Error getting cache', error);
        res.status(400).json({ error: (error as Error).message });
    }
}

export const cacheCode = async (req: Request, res: Response) => {
    try {
        const sessionId = req.body.sessionId;
        const code = req.body.code;
        const language = req.body.language;
        const newLanguage = req.body.newLanguage;

        if (sessionId === undefined || code === undefined || language === undefined || newLanguage === undefined) {
            res.status(400).json({ error: "Error caching" });
            return;
        }
        await redisClient.hset(sessionId, language, code); 
        await redisClient.hset(sessionId, "currLanguage", newLanguage); 
        res.status(200).json({"message": "code cached"});
    } catch (error) {
        console.error('Error caching', error);
        res.status(400).json({ error: (error as Error).message });
    }
};
