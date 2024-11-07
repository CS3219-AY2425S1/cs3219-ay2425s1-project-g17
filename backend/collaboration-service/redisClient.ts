import Redis from 'ioredis';

export const redisClient = new Redis({
  host: process.env.REDIS_URI,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
});
