import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient'; // Import Redis client
import { generateToken } from "../utils/tokenGenerator"
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: (process.env.AWS_ELB_URI ?? "http://collaboration-service") + ":4003/collaboration",
  timeout: 5000,
});

console.log(api.getUri);

export const matchUser = async (userId: string, category: string) => {
  // Log the matching attempt
  const user = await redisClient.hgetall(`match:${userId}`);

  if (user && user.isMatched === 'false') {
    const difficulty: DIFFICULTY = user.difficulty as DIFFICULTY;

    // Try to find an available match in the same category and difficulty (Highest Priority)
    const potentialMatchKeys = await redisClient.keys(`match:*`);

    // Fetch createdAt values and sort potentialMatchKeys based on it
    const potentialUsers = await Promise.all(
      potentialMatchKeys.map(async (key) => {
        const potentialUser = await redisClient.hgetall(key);
        return { key, createdAt: Number(potentialUser.createdAt) };
      })
    );
    
    // Sort by createdAt in increasing order
    potentialUsers.sort((a, b) => a.createdAt - b.createdAt);
    
    // Extract sorted keys
    const sortedPotentialMatchKeys = potentialUsers.map(user => user.key);

    for (const key of sortedPotentialMatchKeys) {
      
      const potentialUser = await redisClient.hgetall(key);
      if (potentialUser.userId !== userId && potentialUser.category === category && potentialUser.difficulty === difficulty && potentialUser.isMatched === 'false') {
        // Mark both users as matched and update partnerIds
        user.isMatched = 'true';
        user.partnerId = potentialUser.userId;
        user.partnerUsername = potentialUser.username;
        potentialUser.isMatched = 'true';
        potentialUser.partnerId = userId;
        potentialUser.partnerUsername = user.username;

        // Update assigned categories and difficulties
        if (user.createdAt <= potentialUser.createdAt) {
          user.difficultyAssigned = user.difficulty;
          user.categoryAssigned = user.category;
          potentialUser.difficultyAssigned = user.difficulty;
          potentialUser.categoryAssigned = user.category;
        } else {
          user.difficultyAssigned = potentialUser.difficulty;
          user.categoryAssigned = potentialUser.category;
          potentialUser.difficultyAssigned = potentialUser.difficulty;
          potentialUser.categoryAssigned = potentialUser.category;
        }

        await redisClient.multi().hmset(`match:${userId}`, user).hmset(`match:${potentialUser.userId}`, potentialUser).exec();
        const count = (await getUsersFromQueue()).length;
        console.log(`User ${potentialUser.userId} and User ${user.userId} have been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}, total users currently in the queue: ${count}`);
        sendDetailsToCollab(user.userId, user.partnerId, user.categoryAssigned, user.difficultyAssigned);
        return potentialUser;
      }
    }
    const currentTime = Date.now();
    if (Number(user.createdAt) < currentTime - 15000) {
      for (const key of sortedPotentialMatchKeys) {
        const potentialUser = await redisClient.hgetall(key);
        if (potentialUser.userId !== userId && potentialUser.category === category && potentialUser.isMatched === 'false' && Number(potentialUser.createdAt) < currentTime - 15000) {
          // Mark both users as matched and update partnerIds
          user.isMatched = 'true';
          user.partnerId = potentialUser.userId;
          potentialUser.isMatched = 'true';
          potentialUser.partnerId = userId;
          user.partnerUsername = potentialUser.username;
          potentialUser.partnerUsername = user.username;

          // Update assigned categories and difficulties
          if (user.createdAt <= potentialUser.createdAt) {
            user.difficultyAssigned = user.difficulty;
            user.categoryAssigned = user.category;
            potentialUser.difficultyAssigned = user.difficulty;
            potentialUser.categoryAssigned = user.category;
          } else {
            user.difficultyAssigned = potentialUser.difficulty;
            user.categoryAssigned = potentialUser.category;
            potentialUser.difficultyAssigned = potentialUser.difficulty;
            potentialUser.categoryAssigned = potentialUser.category;
          }

          await redisClient.multi().hmset(`match:${userId}`, user).hmset(`match:${potentialUser.userId}`, potentialUser).exec();
          const count = (await getUsersFromQueue()).length;
          console.log(`User ${potentialUser.userId} and User ${user.userId} have been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}, total users currently in the queue: ${count}`);
          sendDetailsToCollab(user.userId, user.partnerId, user.categoryAssigned, user.difficultyAssigned);
          return potentialUser;
        }
      }
    }

    if (Number(user.createdAt) < currentTime - 30000) {
      for (const key of sortedPotentialMatchKeys) {
        const potentialUser = await redisClient.hgetall(key);
        if (potentialUser.userId !== userId && potentialUser.difficulty === difficulty && potentialUser.isMatched === 'false' && Number(potentialUser.createdAt) < currentTime - 30000) {
          // Mark both users as matched and update partnerIds
          user.isMatched = 'true';
          user.partnerId = potentialUser.userId;
          potentialUser.isMatched = 'true';
          potentialUser.partnerId = userId;
          user.partnerUsername = potentialUser.username;
          potentialUser.partnerUsername = user.username;

          // Update assigned categories and difficulties
          if (user.createdAt <= potentialUser.createdAt) {
            user.difficultyAssigned = user.difficulty;
            user.categoryAssigned = user.category;
            potentialUser.difficultyAssigned = user.difficulty;
            potentialUser.categoryAssigned = user.category;
          } else {
            user.difficultyAssigned = potentialUser.difficulty;
            user.categoryAssigned = potentialUser.category;
            potentialUser.difficultyAssigned = potentialUser.difficulty;
            potentialUser.categoryAssigned = potentialUser.category;
          }

          await redisClient.multi().hmset(`match:${userId}`, user).hmset(`match:${potentialUser.userId}`, potentialUser).exec();
          const count = (await getUsersFromQueue()).length;
          console.log(`User ${potentialUser.userId} and User ${user.userId} have been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}, total users currently in the queue: ${count}`);
          sendDetailsToCollab(user.userId, user.partnerId, user.categoryAssigned, user.difficultyAssigned);
          return potentialUser;
        }
      }
    }
    // Return null if no match found
    return null;
  }
};

// Function to fetch users from the queue of a specific difficulty
export async function getUsersFromQueue(): Promise<any[]> {
  try {
    // Fetch users from Redis who are still in the queue and not yet matched
    const keys = await redisClient.keys('match:*');
    const usersInQueue = [];
    for (const key of keys) {
      const user = await redisClient.hgetall(key);
      if (user.isMatched === 'false') {
        usersInQueue.push(user);
      }
    }
    return usersInQueue.sort((a, b) => Number(a.createdAt) - Number(b.createdAt)); // Sort by creation time
  } catch (err) {
    console.error(`Error fetching users from queue: ${err}`);
    return [];
  }
}

export function handleAxiosError(error: any) {
  if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return error.response?.data?.message || 'An error occurred while processing your request';
  } else {
      console.error("Unexpected error:", error);
      return 'An unexpected error occurred';
  }
}

export async function sendDetailsToCollab(user1Id: string, user2Id: string, category: string, difficulty: string) {
  try {
      const bearerToken = generateToken(user1Id);
      await api.post('/', {user1Id, user2Id, category, difficulty}, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
  } catch (error) {
      throw new Error(handleAxiosError(error));
  }
}