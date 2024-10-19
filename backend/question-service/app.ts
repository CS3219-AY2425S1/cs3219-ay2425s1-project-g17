import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import questionRoutes from './routes/questionRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/questions', questionRoutes);

// MongoDB connection
const connectToMongoDB = async (uri: string, type: string) => {
  try {
    await mongoose.connect(uri, { dbName: "question" });
    console.log("Connected to MongoDB " + type + " successfully!");
  } catch (error) {
    console.error("MongoDB " + type + " connection error:", error);
  }
};

export { app, connectToMongoDB };
