import { Request, Response } from 'express';
import { Match, DIFFICULTY } from '../model/matchModel';

export const requestMatch = async (req: Request, res: Response) => {
  const { userId, category, difficulty } = req.body;
  try {
    // Validate that the difficulty is one of the enum values
    if (!Object.values(DIFFICULTY).includes(difficulty)) {
      return res.status(400).json({ success: false, message: 'Invalid difficulty' });
    }

    const matchRequest = {
      userId,
      category,
      difficulty: difficulty as DIFFICULTY,
      createdAt: new Date(),
    };

    // Save the match request to the database
    await Match.create(matchRequest);

    console.log(`Message sent to the queue`, matchRequest);

    res.status(202).json({ success: true, message: `User added to ${difficulty} queue` });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const checkMatchStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Check if user is matched
    const match = await Match.findOne({ userId, isMatched: true });
    if (match) {
      const user = match.userId
      const partner = match.partnerId;
      const categoryAssigned = match.categoryAssigned;
      const difficultyAssigned = match.difficultyAssigned;

      await Match.findOneAndDelete({userId: user, partnerId: partner});
      console.log(`User ${user} removed from queue after being matched`)
      return res.status(200).json({ matched: true, partnerId: partner, categoryAssigned: categoryAssigned, difficultyAssigned: difficultyAssigned });
    } 

    // Check if user has been removed from the queue without getting matched
    const userInQueue = await Match.findOne({userId, isMatched: false, partnerId: null, categoryAssigned: null, difficultyAssigned: null});
    if (!userInQueue) {
      return res.status(200).json({removed: true});
    }

    // User is still in queue, but has not found a match yet
    res.status(200).json({ matched: false });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

