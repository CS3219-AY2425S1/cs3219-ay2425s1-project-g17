import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Question document
export enum DIFFICULTY {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
}

interface IQuestion extends Document {
    question_id: number;
    question_title: string;
    question_description: string;
    question_categories: string[];
    question_complexity: DIFFICULTY;
    question_popularity: number;
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
const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;