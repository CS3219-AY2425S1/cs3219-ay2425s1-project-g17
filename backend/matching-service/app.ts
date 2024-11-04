import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import matchRoutes from './route/matchRoute';
import './queue_worker/matchWorker';
import { redisClient } from './redisClient';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? "";

// Call this function to check Redis connection
const connectToRedis = async () => {
  try {
    await redisClient.ping();
    console.log("Connected to Redis successfully!");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};

connectToRedis();

app.use(cors());
app.use(express.json());

// To handle CORS Errors
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  // Browsers usually send this before PUT or POST Requests
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    return res.status(200).json({});
  }

  // Continue Route Processing
  next();
});

app.use('/matching', matchRoutes);

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from matching-service"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});