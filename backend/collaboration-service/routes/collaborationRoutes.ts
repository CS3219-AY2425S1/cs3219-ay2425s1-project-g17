import express from 'express';
import { createCollaborationRoom, getCollaborationRoom, shuffleQuestion, disconnectUser, getCacheCode, cacheCode }  from '../controller/collabController';
import { verifyAccessToken } from '../middleware/collaborationMiddleware';  

const router = express.Router();

// GET endpoints
router.get('/:id', verifyAccessToken, getCollaborationRoom);
router.get('/shuffle/:id', verifyAccessToken, shuffleQuestion);
router.get('/cache/:id/:language', verifyAccessToken, getCacheCode);

// Post endpoints
router.post('/', verifyAccessToken, createCollaborationRoom);
router.post('/disconnect', verifyAccessToken, disconnectUser);
router.post("/cache", verifyAccessToken, cacheCode)

export default router;
