import express from "express";
import { getHistory, createHistory } from "../controller/historyController";
import { verifyAccessToken } from "../middleware/historyMiddleware";

const router = express.Router();

// Get endpoint
router.get('/:id', verifyAccessToken, getHistory);

// Post endpoint
router.post('/', verifyAccessToken, createHistory);

export default router;