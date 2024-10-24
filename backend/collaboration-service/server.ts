import dotenv from "dotenv";
import { httpServer, connectToRedis } from "./app";

dotenv.config();

const port = process.env.PORT ?? '';
const redisPass = process.env.REDIS_PASS ?? '';
const redisUri = process.env.REDIS_URI ?? '';
const redisPort = Number(process.env.REDIS_PORT) ?? '';

export const redisClient = await connectToRedis(redisUri, redisPass, redisPort);

httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});