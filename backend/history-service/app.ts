import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import historyRoutes from './routes/historyRoutes';
import questionCountRoutes from './routes/questionCountRoutes';
import CustomError from './utils/customError';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/history", historyRoutes);
app.use("/questioncount", questionCountRoutes);

app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log("Sending Greetings!");
  res.json({
    message: "Hello World from history-service"
  });
});

// Handle When No Route Match Is Found
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error: CustomError = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((error: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(error.status || 500);
  console.log(error.status);
  res.json({
    error: {
      message: error.message
    }
  });
});

// MongoDB connection
const connectToMongoDB = async (uri: string, type: string) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB " + type + " successfully!");
  } catch (error) {
    console.error("MongoDB " + type + " connection error:", error);
  }
};

export { app, connectToMongoDB };
