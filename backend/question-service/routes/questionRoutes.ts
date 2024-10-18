import express from 'express';
import {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById,
    getQuestionCategories,
    uploadQuestions
} from '../controller/questionController';
import { verifyAccessToken, uploadMiddleware } from '../middleware/questionMiddleware';  

const router = express.Router();

// Get endpoints
router.get('/', verifyAccessToken, getAllQuestions);
router.get('/categories', verifyAccessToken, getQuestionCategories);
router.get('/:id', verifyAccessToken, getQuestionById);

// Post endpoints
router.post('/', verifyAccessToken, createQuestion);
router.post('/upload', verifyAccessToken, uploadMiddleware, uploadQuestions);

// Put endpoints
router.put('/:id', verifyAccessToken, updateQuestionById);

// Delete endpoints
router.delete('/:id', verifyAccessToken, deleteQuestionById);

export default router;
