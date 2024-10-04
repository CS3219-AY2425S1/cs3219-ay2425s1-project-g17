import { Router } from 'express';
import { requestMatch, checkMatchStatus } from '../controller/matchController';

const router = Router();

router.post('/match-request', requestMatch);
router.get('/check-match-status/:userId', checkMatchStatus);

export default router;
