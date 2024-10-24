import dotenv from "dotenv";
import { httpServer } from "./app";

dotenv.config();

const port = process.env.PORT ?? '';
const redisPass = process.env.REDIS_PASS ?? '';
const redisUri = process.env.REDIS_URI ?? '';
const redisPort = Number(process.env.REDIS_PORT) ?? '';

httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});