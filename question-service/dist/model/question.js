"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIFFICULTY = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the interface for the Question document
var DIFFICULTY;
(function (DIFFICULTY) {
    DIFFICULTY["EASY"] = "EASY";
    DIFFICULTY["MEDIUM"] = "MEDIUM";
    DIFFICULTY["HARD"] = "HARD";
})(DIFFICULTY || (exports.DIFFICULTY = DIFFICULTY = {}));
// Define the schema for the Question
const QuestionSchema = new mongoose_1.Schema({
    question_id: {
        type: String,
        required: true,
        unique: true
    },
    question_title: {
        type: String,
        required: true
    },
    question_description: {
        type: String,
        required: true
    },
    question_categories: {
        type: [String],
        required: true
    },
    question_complexity: {
        type: String,
        enum: Object.values(DIFFICULTY),
        required: true
    },
    question_popularity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});
// Create the model
const Question = mongoose_1.default.model('Question', QuestionSchema);
exports.default = Question;
