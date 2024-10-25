import express from 'express';
import { createCollaborationRoom, getCollaborationRoom, shuffleQuestion, disconnectUser, submitAttempt }  from '../controller/collabController';

const router = express.Router();

// GET endpoints
router.get('/:id', getCollaborationRoom);
router.get('/shuffle/:id', shuffleQuestion);

// Post endpoints
router.post('/', createCollaborationRoom);
router.post('/disconnect', disconnectUser);
router.post('/submit', submitAttempt);

export default router;
