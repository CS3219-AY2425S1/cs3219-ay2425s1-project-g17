import express from 'express';
import { createChatRoom, getChatRoom } from '../controller/chatController';

const router = express.Router();

router.post('/create', createChatRoom);
router.get('/:sessionId', getChatRoom);

export default router;
