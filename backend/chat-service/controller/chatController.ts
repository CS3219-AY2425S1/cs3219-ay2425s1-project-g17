import { Server, Socket } from 'socket.io';
import { redisClient } from '../redisClient';

const saveMessage = async (message: string, sessionId: string, sender: string) => {
    const messages = await redisClient.hgetall(sessionId);
    const msgId = Object.keys(messages).length + 1;
    const messageObject = { sender: sender, message: message };
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
            saveMessage(message, sessionId, userId);
            socket.to(sessionId).emit('receiveMessage', { message, username });
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
