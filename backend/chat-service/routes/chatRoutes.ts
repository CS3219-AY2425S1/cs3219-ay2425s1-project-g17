import express from 'express';
import { getSessionMessages }  from '../controller/chatController';

const router = express.Router();

// GET endpoints
router.get('/:id', getSessionMessages);

export default router;
