import { Router } from 'express';
import { requestMatch, checkMatchStatus, cancelMatch } from '../controller/matchController';

const router = Router();

router.post('/match-request', requestMatch);
router.get('/check-match-status/:userId', checkMatchStatus);
router.post('/cancel-match-request', cancelMatch);

export default router;