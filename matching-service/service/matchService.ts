import { Match, DIFFICULTY } from '../model/matchModel';

export const matchUser = async (userId: string, category: string) => {
  // Log the matching attempt
  const user = await Match.findOne({
    category,
    isMatched: false,
    userId: userId
  });

  if (user) {
    const difficulty: DIFFICULTY = user.difficulty as DIFFICULTY;
    console.log(`Attempting to match user: ${userId}, category: ${category}, difficulty: ${difficulty}`);

    // Try to find an available match in the same category and difficulty (Highest Priority) for the first 10 seconds
    const potentialMatch = await Match.findOne({
      category,
      difficulty,
      isMatched: false,
      userId: { $ne: userId }
    });

    // Check if a potential match exists and if it's not the same user
    if (potentialMatch) {
      // Log found match
      console.log(`Match found: User ${potentialMatch.userId} for User ${userId}`);
      
      // Mark both users as matched and update partnerIds
      user.isMatched = true;
      user.partnerId = potentialMatch.userId;
      potentialMatch.isMatched = true;
      potentialMatch.partnerId = userId;
      console.log(`User ${userId}'s match status is now: ${user.isMatched}`);
      console.log(`User ${potentialMatch.userId}'s match status is now: ${potentialMatch.isMatched}`);

      // Determine which category and difficulty of question both users will attempt together based on who was in queue earliest
      if (user.createdAt <= potentialMatch.createdAt) {
        user.difficultyAssigned = user.difficulty;
        user.categoryAssigned = user.category;
        potentialMatch.difficultyAssigned = user.difficulty;
        potentialMatch.categoryAssigned = user.category;
      } else {
        user.difficultyAssigned = potentialMatch.difficulty;
        user.categoryAssigned = potentialMatch.difficulty;
        potentialMatch.difficultyAssigned = potentialMatch.difficulty;
        potentialMatch.categoryAssigned = potentialMatch.difficulty;
      }

      await potentialMatch.save();
      await user.save();
      console.log(`User ${potentialMatch.userId} and User ${userId} have been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}`);
      return potentialMatch;
    }

    // If unable to find match with same category and difficulty within 15 seconds, prioritise finding match with same category
    const currentTime = Date.now();
    if (user.createdAt < new Date(currentTime - 15000)) {
      console.log("Expanded search... now including same category only search")
      const secondAttempt = await Match.findOne({
        category,
        isMatched: false,
        userId: { $ne: userId }
      });

      // Check if a potential match exists and if it's not the same user
      if (secondAttempt) {
        // Log found match
        console.log(`Match found: User ${secondAttempt.userId} for User ${userId}`);
        

        // Mark both users as matched and update partnerIds
        user.isMatched = true;
        user.partnerId = secondAttempt.userId;
        secondAttempt.isMatched = true;
        secondAttempt.partnerId = userId;
        console.log(`User ${userId}'s match status is now: ${user.isMatched}`);
        console.log(`User ${secondAttempt.userId}'s match status is now: ${secondAttempt.isMatched}`);

        // Determine which category and difficulty of question both users will attempt together based on who was in queue earliest
        if (user.createdAt <= secondAttempt.createdAt) {
          user.difficultyAssigned = user.difficulty;
          user.categoryAssigned = user.category;
          secondAttempt.difficultyAssigned = user.difficulty;
          secondAttempt.categoryAssigned = user.category;
        } else {
          user.difficultyAssigned = secondAttempt.difficulty;
          user.categoryAssigned = secondAttempt.difficulty;
          secondAttempt.difficultyAssigned = secondAttempt.difficulty;
          secondAttempt.categoryAssigned = secondAttempt.difficulty;
        }

        await secondAttempt.save();
        await user.save();
        console.log(`User ${secondAttempt.userId} and User ${userId} has been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}`);
        return secondAttempt;
      }
    }
    

    // Lastly, find a match with same difficulty chosen if user has been in queue for 30 seconds without a match.
    if (user.createdAt < new Date(currentTime - 30000)) {
      console.log("Expanded search... now including same difficulty only search")
      const thirdAttempt = await Match.findOne({
        difficulty,
        isMatched: false,
        userId: { $ne: userId }
      });

      // Check if a potential match exists and if it's not the same user
      if (thirdAttempt) {
        // Log found match
        console.log(`Match found: User ${thirdAttempt.userId} for User ${userId}`);
        

        // Mark both users as matched and update partnerIds
        user.isMatched = true;
        user.partnerId = thirdAttempt.userId;
        thirdAttempt.isMatched = true;
        thirdAttempt.partnerId = userId;
        console.log(`User ${userId}'s match status is now: ${user.isMatched}`);
        console.log(`User ${thirdAttempt.userId}'s match status is now: ${thirdAttempt.isMatched}`);

        // Determine which category and difficulty of question both users will attempt together based on who was in queue earliest
        if (user.createdAt <= thirdAttempt.createdAt) {
          user.difficultyAssigned = user.difficulty;
          user.categoryAssigned = user.category;
          thirdAttempt.difficultyAssigned = user.difficulty;
          thirdAttempt.categoryAssigned = user.category;
        } else {
          user.difficultyAssigned = thirdAttempt.difficulty;
          user.categoryAssigned = thirdAttempt.difficulty;
          thirdAttempt.difficultyAssigned = thirdAttempt.difficulty;
          thirdAttempt.categoryAssigned = thirdAttempt.difficulty;
        }

        await thirdAttempt.save();
        await user.save();
        console.log(`User ${thirdAttempt.userId} and User ${userId} has been assigned a ${user.difficultyAssigned} question about ${user.categoryAssigned}`);
        return thirdAttempt;
      }
    }

    // Return null if no match found
    console.log(`No match found for user: ${userId}`);
    return null;
  }
  
};

// Function to fetch users from the queue of a specific difficulty
export async function getUsersFromQueue(): Promise<any[]> {
  try {
      // Fetch users from MongoDB who are still in the queue and not yet matched
      const usersInQueue = await Match.find({isMatched: false }).exec();
      return usersInQueue;
  } catch (err) {
      console.error(`Error fetching users from queue: ${err}`);
      return [];
  }
}