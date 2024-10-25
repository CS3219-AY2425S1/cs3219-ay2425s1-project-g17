import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import collaborationRoutes from './routes/collaborationRoutes';



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/collaboration', collaborationRoutes);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    //console.log(`User Connected: ${socket.id}`);
  
    socket.on('joinSession', ({ userId, roomId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on('shuffleQuestion', (sessionId) => {
      console.log(`Shuffle question signal received for session: ${sessionId}`);
      socket.to(sessionId).emit('shuffle', "-");
    });

    socket.on('disconnectUser', ({sessionId, userId}) => {
      console.log(`User: ${userId} is disconnecting from ${sessionId}`);
      socket.to(sessionId).emit('disconnectUser', "-");
    });

    socket.on('submit',  (sessionId) => {
      console.log(`Submit question signal received for session: ${sessionId}`);
      socket.to(sessionId).emit('submit', "-");
    });

    socket.on('confirmSubmit',  (sessionId) => {
      console.log(`Confirm Submit question signal received for session: ${sessionId}`);
      socket.to(sessionId).emit('confirmSubmit', "-");
    });
  });

export { httpServer, io };
