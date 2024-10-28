import express from 'express';
import { createCollaborationRoom, getCollaborationRoom, shuffleQuestion, disconnectUser, submitAttempt, getCacheCode, cacheCode }  from '../controller/collabController';

const router = express.Router();

// GET endpoints
router.get('/:id', getCollaborationRoom);
router.get('/shuffle/:id', shuffleQuestion);
router.get('/cache/:id/:language', getCacheCode);

// Post endpoints
router.post('/', createCollaborationRoom);
router.post('/disconnect', disconnectUser);
router.post('/submit', submitAttempt);
router.post("/cache", cacheCode)

export default router;
