import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from "cors";
import matchRoutes from './route/matchRoute';
import './queue_worker/matchWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? "";

const connectToMongoDB = async () => {mongoose
    .connect(process.env.MONGODB_URI || '', {
        dbName: "Matching-Service",
    })
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((error) => console.error("MongoDB connection eror:", error))

  
};

// Call this function in your app.ts
connectToMongoDB();

app.use(cors());
app.use(express.json());
//app.use(express.static('public')); // Serve static files from the 'public' directory
app.use('/matching', matchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
