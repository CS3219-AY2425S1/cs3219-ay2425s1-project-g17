import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import chatRoutes from './routes/chatRoutes';
import { handleSocketEvents } from './controller/chatController';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/chat', chatRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

handleSocketEvents(io);

export { httpServer };
