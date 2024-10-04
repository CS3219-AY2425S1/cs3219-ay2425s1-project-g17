import { matchUser, getUsersFromQueue } from '../service/matchService';
import { Match, DIFFICULTY } from '../model/matchModel';

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

  // Fetch users from MongoDB who are in the queue but have exceeded the 45-second timeout
  const expiredUsers = await Match.find({
      isMatched: false,
      createdAt: { $lt: new Date(currentTime - TIMEOUT_MS) }  // Users created more than 45 seconds ago
  });
  
  for (const user of expiredUsers) {
      const user_to_delete = user.userId;
      // Remove the user from the queue and database
      await Match.findOneAndDelete({userId: user_to_delete,
      });
      console.log(`User ${user_to_delete} removed due to timeout.`);
  }
}

// Schedule a periodic job to check every second for expired users
setInterval(checkForExpiredUsers, 1000);  // Check every 1 second
setInterval(checkAllQueuesForMatches, 4000);



