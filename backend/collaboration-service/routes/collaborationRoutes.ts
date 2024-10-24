import express from 'express';
import { createCollaborationRoom, getCollaborationRoom }  from '../controller/collabController';

const router = express.Router();

// GET endpoints
router.get('/:id', getCollaborationRoom);

// Post endpoints
router.post('/', createCollaborationRoom);

export default router;
