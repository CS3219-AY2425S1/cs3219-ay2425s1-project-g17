import express from "express";
import { getQuestionCount } from "../controller/historyController";

const router = express.Router();

router.get('/', getQuestionCount);

export default router;