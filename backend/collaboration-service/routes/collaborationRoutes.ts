import express from 'express';
import { createCollaborationRoom }  from '../controller/collabController';

const router = express.Router();

// Post endpoints
router.post('/', createCollaborationRoom);

export default router;
