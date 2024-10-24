import express from 'express';
import { createCollaborationRoom, getCollaborationRoom, shuffleQuestion }  from '../controller/collabController';

const router = express.Router();

// GET endpoints
router.get('/:id', getCollaborationRoom);
router.get('/shuffle/:id', shuffleQuestion);

// Post endpoints
router.post('/', createCollaborationRoom);

export default router;
