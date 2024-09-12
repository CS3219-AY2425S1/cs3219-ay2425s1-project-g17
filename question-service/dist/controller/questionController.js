"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestionById = exports.updateQuestionById = exports.getQuestionById = exports.getAllQuestions = exports.createQuestion = void 0;
const questionModel_1 = __importDefault(require("../model/questionModel"));
// Utility function to convert string to number
const toNumber = (id) => parseInt(id, 10);
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionData = req.body;
        const question = new questionModel_1.default(questionData);
        yield question.save();
        res.status(201).json(question);
    }
    catch (error) {
        console.error('Error creating question:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.createQuestion = createQuestion;
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield questionModel_1.default.find();
        res.status(200).json(questions);
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.getAllQuestions = getAllQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = toNumber(req.params.id);
        const question = yield questionModel_1.default.findOne({ question_id: questionId });
        if (question) {
            res.status(200).json(question);
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.getQuestionById = getQuestionById;
const updateQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = toNumber(req.params.id);
        const updatedQuestion = yield questionModel_1.default.findOneAndUpdate({ question_id: questionId }, req.body, { new: true });
        if (updatedQuestion) {
            res.status(200).json(updatedQuestion);
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        console.error('Error updating question by ID:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.updateQuestionById = updateQuestionById;
const deleteQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = toNumber(req.params.id);
        const result = yield questionModel_1.default.findOneAndDelete({ question_id: questionId });
        if (result) {
            res.status(200).json({ message: 'Question deleted' });
        }
        else {
            res.status(404).json({ message: 'Question not found' });
        }
    }
    catch (error) {
        console.error('Error deleting question by ID:', error);
        res.status(400).json({ error: error.message });
    }
});
exports.deleteQuestionById = deleteQuestionById;
