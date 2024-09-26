import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Question document
export enum DIFFICULTY {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

type Example = {
    input: string;
    output: string;
    explanation: string;
};

interface IQuestion extends Document {
    question_id: number;
    question_title: string;
    question_description: string;
    question_categories: string[];
    question_complexity: DIFFICULTY;
    question_popularity: number;
    question_examples?: Example[];
}

// Define the schema for the Question
const QuestionSchema: Schema = new Schema({
    question_id: {
        type: Number,
        required: true,
        unique: true
    },
    question_title: {
        type: String,
        required: true,
        unique: true
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
    },
    question_example: {
        type: [
            {
                input: { type : String, required: true },
                output: { type : String, required: true },
                explanation: { type : String }
            }
        ],
        default: []
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model
const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;