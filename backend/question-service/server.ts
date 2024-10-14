import dotenv from "dotenv";
import { app, connectToMongoDB } from "./app";

dotenv.config();

const port = process.env.PORT ?? '';
const mongoUri = process.env.MONGO_URI ?? '';

connectToMongoDB(mongoUri, "PROD");

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});