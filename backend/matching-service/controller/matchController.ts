import { Request, Response } from 'express';
import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient'; // Import Redis client
import { getUsersFromQueue } from '../service/matchService';

export const requestMatch = async (req: Request, res: Response) => {
  const { userId, username, category, difficulty } = req.body;
  try {
    // Validate that the difficulty is one of the enum values
    if (!Object.values(DIFFICULTY).includes(difficulty)) {
      return res.status(400).json({ success: false, message: 'Invalid difficulty' });
    }

    const matchRequest = {
      username,
      userId,
      category,
      difficulty: difficulty as DIFFICULTY,
      createdAt: Date.now(),
      isMatched: false,
      partnerUsername: null,
      partnerId: null,
      categoryAssigned: null,
      difficultyAssigned: null,
    };

    // Save the match request to Redis
    await redisClient.hset(`match:${userId}`, matchRequest);

    const count = (await getUsersFromQueue()).length;
    console.log(`User ${userId} has joined the queue with category ${category} and difficulty ${difficulty}, total users currently in the queue: ${count}`)

    res.status(202).json({ success: true, message: `User added to queue` });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const checkMatchStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Check if user is matched
    const match = await redisClient.hgetall(`match:${userId}`);
    if (match && match.isMatched === 'true') {
      const partnerId = match.partnerId;
      const partnerUsername = match.partnerUsername
      const categoryAssigned = match.categoryAssigned;
      const difficultyAssigned = match.difficultyAssigned;

      await redisClient.del(`match:${userId}`); // Remove from Redis
      return res.status(200).json({ matched: true, partnerId: partnerId, partnerUsername: partnerUsername, categoryAssigned, difficultyAssigned });
    }

    // Check if user has been removed from the queue without getting matched
    const userInQueue = await redisClient.hgetall(`match:${userId}`);
    if (!userInQueue) {
      return res.status(200).json({ removed: true });
    }

    // User is still in queue, but has not found a match yet
    res.status(200).json({ matched: false });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const cancelMatch = async (req: Request, res: Response) => {
  const { userId, username } = req.body;
  try {
    const key = await redisClient.keys(`match:${userId}`);
    await redisClient.del(key);

    const count = (await getUsersFromQueue()).length;
    console.log(`User ${userId} has left the queue due to cancellation, total users currently in the queue: ${count}`)

    res.status(202).json({ success: true, message: `User removed from queue` });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const checkIfUserInQueue = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const userInQueue = await redisClient.hgetall(`match:${userId}`);
    if (userInQueue) {
      return res.status(202).json({ inQueue: true });
    }
    res.status(202).json({ inQueue: false });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};