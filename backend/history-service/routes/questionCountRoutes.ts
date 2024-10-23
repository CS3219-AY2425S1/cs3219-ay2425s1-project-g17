import express from "express";
import { getQuestionCount } from "../controller/historyController";
import { verifyAccessToken } from "../middleware/historyMiddleware";

const router = express.Router();

router.get('/', verifyAccessToken, getQuestionCount);

export default router;