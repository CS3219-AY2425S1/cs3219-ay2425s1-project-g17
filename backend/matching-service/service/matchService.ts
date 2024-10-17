import { DIFFICULTY } from '../model/matchModel';
import { redisClient } from '../redisClient'; // Import Redis client

export const matchUser = async (userId: string, category: string) => {
  // Log the matching attempt
  const user = await redisClient.hgetall(`match:${userId}`);

  if (user && user.isMatched === 'false') {
    const difficulty: DIFFICULTY = user.difficulty as DIFFICULTY;
    console.log(`Attempting to match user: ${user.username}, category: ${category}, difficulty: ${difficulty}`);

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
        // Log found match
        console.log(`Match found: User ${potentialUser.username} for User ${user.username}`);

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
        return potentialUser;
      }
    }
    const currentTime = Date.now();
    if (Number(user.createdAt) < currentTime - 15000) {
      console.log("Expanded search... now including same category only search")
      
      for (const key of sortedPotentialMatchKeys) {
        const potentialUser = await redisClient.hgetall(key);
        if (potentialUser.userId !== userId && potentialUser.category === category && potentialUser.isMatched === 'false' && Number(potentialUser.createdAt) < currentTime - 15000) {
          // Log found match
          console.log(`Match found: User ${potentialUser.username} for User ${user.username}`);

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
          return potentialUser;
        }
      }
    }

    if (Number(user.createdAt) < currentTime - 30000) {
      console.log("Expanded search... now including same category only search")

      for (const key of sortedPotentialMatchKeys) {
        const potentialUser = await redisClient.hgetall(key);
        if (potentialUser.userId !== userId && potentialUser.difficulty === difficulty && potentialUser.isMatched === 'false' && Number(potentialUser.createdAt) < currentTime - 30000) {
          // Log found match
          console.log(`Match found: User ${potentialUser.username} for User ${user.username}`);

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
          return potentialUser;
        }
      }
    }
    // Return null if no match found
    console.log(`No match found for user: ${user.username}`);
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