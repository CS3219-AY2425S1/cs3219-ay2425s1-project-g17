import Redis from 'ioredis';
import dotenv from "dotenv";
dotenv.config();

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});
