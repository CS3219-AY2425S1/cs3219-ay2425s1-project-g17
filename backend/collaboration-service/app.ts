import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "redis";
import bodyParser from "body-parser";
import collaborationRoutes from './routes/collaborationRoutes';



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/collaboration', collaborationRoutes);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      console.log(data);
    });
  });

// Redis connection
const connectToRedis = async (uri: string, pass: string, port: number) => {
    try {
      const client = createClient({
        password: pass,
        socket: {
            host: uri,
            port: port
        }
      });
      client.on('error', (err) => console.log(err));
      if (!client.isOpen) {
        client.connect();
      }
      console.log("Connected to Redis successfully!");
    } catch (error) {
      console.error("Redis connection error: ", error);
    }
  };

export { httpServer, connectToRedis };


/*
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

*/