import { Server, Socket } from 'socket.io';
import { redisClient } from '../redisClient';
import { Request, Response } from 'express';

export const getSessionMessages = async (req: Request, res: Response) => {
    const sessionId = req.params.id;
    const sessionMessages = await redisClient.hgetall(sessionId);
    res.status(200).json(sessionMessages);
}

const saveMessage = async (message: string, sessionId: string, senderId: string, senderName: string) => {
    const messages = await redisClient.hgetall(sessionId);
    const msgId = Object.keys(messages).length + 1;
    const messageObject = { senderId: senderId, senderName: senderName, message: message };
    await redisClient.hset(sessionId, msgId, JSON.stringify(messageObject));
}

export const handleSocketEvents = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        socket.on('joinSession', ({ userId, sessionId }) => {
            socket.join(sessionId);
            console.log(`User ${userId} joined room ${sessionId}`);
        });

        socket.on('sendMessage', ({ sessionId, message, userId, username }) => {
            console.log(`Message sent to session ${sessionId} by ${username} (${userId}): ${message}`);
            saveMessage(message, sessionId, userId, username);
            socket.to(sessionId).emit('receiveMessage', { message, username });
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
