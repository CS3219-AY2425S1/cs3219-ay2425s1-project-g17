import express from 'express';
import { getSessionMessages, deleteSessionMessages }  from '../controller/chatController';

const router = express.Router();

// GET endpoints
router.get('/:id', getSessionMessages);

// POST endpoints
router.delete('/:id', deleteSessionMessages);

export default router;
