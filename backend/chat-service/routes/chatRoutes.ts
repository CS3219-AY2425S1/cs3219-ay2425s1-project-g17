import express from 'express';
import { getSessionMessages, deleteSessionMessages }  from '../controller/chatController';
import { verifyAccessToken } from '../middleware/chatMiddleware';  

const router = express.Router();

// GET endpoints
router.get('/:id', verifyAccessToken, getSessionMessages);

// POST endpoints
router.delete('/:id', verifyAccessToken, deleteSessionMessages);

export default router;
