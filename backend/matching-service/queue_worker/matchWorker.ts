import { matchUser, getUsersFromQueue } from '../service/matchService';
import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient';

const TIMEOUT_MS = 45000; // 45 seconds timeout
const difficulties: DIFFICULTY[] = [DIFFICULTY.EASY, DIFFICULTY.MEDIUM, DIFFICULTY.HARD];

let isMatchingUser = false; // Flag to indicate if matchUser is currently running

async function checkAllQueuesForMatches() {
  try {
    const usersInQueue = await getUsersFromQueue();

    if (usersInQueue.length > 0) {
      // Try to match each user in the queue
      for (const user of usersInQueue) {
        if (!isMatchingUser) { // Check if matchUser is not currently running
          isMatchingUser = true; // Set the flag to true before calling matchUser
          await matchUser(user.userId, user.category);
          isMatchingUser = false; // Reset the flag after matchUser completes
        } else {
          break; // Exit the loop if matchUser is already running
        }
      }
    }
  } catch (err) {
    console.error(`Error checking queue`);
  }
}


// Function to periodically check and remove expired users
async function checkForExpiredUsers() {
  const currentTime = Date.now();

  // Fetch users from Redis who are in the queue but have exceeded the 45-second timeout
  const keys = await redisClient.keys('match:*');
  for (const key of keys) {
    const match = await redisClient.hgetall(key);
    if (match && match.isMatched === 'false' && (currentTime - Number(match.createdAt)) > TIMEOUT_MS) {
      const userId = match.userId;
      // Remove the user from Redis
      await redisClient.del(key);

      const count = (await getUsersFromQueue()).length;
      console.log(`User ${userId} is removed due to 45s timeout, total users currently in the queue: ${count}`);
    }
  }
}

// Schedule a periodic job to check every second for expired users
setInterval(checkForExpiredUsers, 1000);
setInterval(checkAllQueuesForMatches, 4000);
