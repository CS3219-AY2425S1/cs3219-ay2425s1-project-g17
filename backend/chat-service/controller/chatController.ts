import { Request, Response } from 'express';
import axios from 'axios';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

let activeRooms: Record<string, { user1Id: string, user2Id: string }> = {};

export const createChatRoom = async (req: Request, res: Response) => {
    const user1Id = req.body.user1Id;
    const user2Id = req.body.user2Id;

    const sessionId = uuidv4();
    activeRooms[sessionId] = { user1Id, user2Id };
    res.status(200).json({ sessionId });
};

export const getChatRoom = (req: Request, res: Response) => {
    const sessionId = req.params.sessionId;
    const roomData = activeRooms[sessionId];

    if (roomData) {
        res.status(200).json(roomData);
    } else {
        res.status(404).json({ message: "Session not found" });
    }
};

export const handleSocketEvents = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        //console.log("New user connected:", socket.id);

        socket.on('joinSession', ({ userId, sessionId }) => {
            socket.join(sessionId);
            console.log(`User ${userId} joined room ${sessionId}`);
        });

        socket.on('sendMessage', ({ sessionId, message, username }) => {
            console.log(`Message sent to session ${sessionId} by ${username}: ${message}`);
            socket.to(sessionId).emit('receiveMessage', { message, username });
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
