import { Router } from 'express';
import { requestMatch, checkMatchStatus, cancelMatch, checkIfUserInQueue } from '../controller/matchController';
import { verifyAccessToken } from '../middleware/matchingMiddleware';

const router = Router();

router.post('/match-request', verifyAccessToken, requestMatch);
router.get('/check-match-status/:userId', verifyAccessToken, checkMatchStatus);
router.post('/cancel-match-request', verifyAccessToken, cancelMatch);
router.post('/check-if-in-queue', verifyAccessToken, checkIfUserInQueue)

export default router;