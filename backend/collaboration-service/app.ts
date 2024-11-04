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

// To handle CORS Errors
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Continue Route Processing
  next();
});

app.use('/collaboration', collaborationRoutes);

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from collaboration-service"
  });
});

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

    socket.on('changeLanguage', ({sessionId, newLanguage}) => {
      console.log(`Language change to ${newLanguage} for session: ${sessionId}`);
      socket.to(sessionId).emit('changeLanguage', newLanguage);
    });
  });

  httpServer.removeAllListeners("upgrade");

  httpServer.on("upgrade", (req, socket, head) => {
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