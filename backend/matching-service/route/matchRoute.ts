import { Router } from 'express';
import { requestMatch, checkMatchStatus, cancelMatch, checkIfUserInQueue } from '../controller/matchController';

const router = Router();

router.post('/match-request', requestMatch);
router.get('/check-match-status/:userId', checkMatchStatus);
router.post('/cancel-match-request', cancelMatch);
router.post('/check-if-in-queue', checkIfUserInQueue)

export default router;