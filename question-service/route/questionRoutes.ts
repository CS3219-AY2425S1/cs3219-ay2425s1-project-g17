import { Router } from 'express';
import { 
    createQuestion, 
    getAllQuestions, 
    getQuestionById, 
    updateQuestionById, 
    deleteQuestionById 
} from '../controller/questionController';

const router = Router();

router.post('/', createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', updateQuestionById);
router.delete('/:id', deleteQuestionById);

export default router;