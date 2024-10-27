import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import collaborationRoutes from './routes/collaborationRoutes';
import { wss } from "./utils/websocket";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/collaboration', collaborationRoutes);
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  destroyUpgrade: false
});


io.on("connection", (socket) => {  
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
  });



  httpServer.removeAllListeners("upgrade");

  httpServer.on("upgrade", (req, socket, head) => {
    console.log(req.url)
    if (req.url == "/") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else if (req.url?.startsWith("/socket.io/")) {
      const engineReq = req as any; 
      io.engine.handleUpgrade(engineReq, socket, head);
    } else {
      socket.destroy();
    }
  });

export { httpServer };