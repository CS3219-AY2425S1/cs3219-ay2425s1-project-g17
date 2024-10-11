import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from './routes/QuestionRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ?? '';
const uri = process.env.MONGO_URI ?? '';

// Connect to mongoDB
mongoose
    .connect(uri, {
        dbName: "question",
    })
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((error) => console.error("MongoDB connection eror:", error))

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the routes defined in questionRoutes
app.use('/questions', questionRoutes);

// Start express server
app.listen(port, () => console.log("Server started on port " + port));
