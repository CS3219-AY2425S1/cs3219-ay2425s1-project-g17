import { matchUser, getUsersFromQueue } from '../service/matchService';
import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient'; // Import Redis client

const TIMEOUT_MS = 45000; // 45 seconds timeout
const difficulties: DIFFICULTY[] = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD];

async function checkAllQueuesForMatches() {
  try {
    const usersInQueue = await getUsersFromQueue();

    if (usersInQueue.length > 0) {
      // Try to match each user in the queue
      for (const user of usersInQueue) {
        await matchUser(user.userId, user.category);
      }
    }
  } catch (err) {
    console.error(`Error checking queue`);
  }
}

// A function to periodically check and remove expired users
async function checkForExpiredUsers() {
  const currentTime = Date.now();

  // Fetch users from Redis who are in the queue but have exceeded the 45-second timeout
  const keys = await redisClient.keys('match:*');
  for (const key of keys) {
    const match = await redisClient.hgetall(key);
    if (match && match.isMatched === 'false' && (currentTime - Number(match.createdAt)) > TIMEOUT_MS) {
      const userId = match.userId;
      // Remove the user from the queue and Redis
      await redisClient.del(key);
      console.log(`User ${userId} removed due to timeout.`);
    }
  }
}

// Schedule a periodic job to check every second for expired users
setInterval(checkForExpiredUsers, 1000);  // Check every 1 second
setInterval(checkAllQueuesForMatches, 4000);
