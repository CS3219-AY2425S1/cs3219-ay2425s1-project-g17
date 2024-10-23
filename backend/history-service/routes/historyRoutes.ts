import express from "express";
import { getHistory, createHistory } from "../controller/historyController";

const router = express.Router();

// Get endpoint
router.get('/:id', getHistory);

// Post endpoint
router.post('/', createHistory);

export default router;