import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HistoryModelSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    partnerId: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    attempt: {
        type: String,
        required: true
    }
});

const QuestionCountSchema = new Schema({
    question_id: {
        type: String,
        required: true,
        unique: true
    },
    question_count: {
        type: Number,
        required: true
    }
});

const HistoryModel = mongoose.model("HistoryModel", HistoryModelSchema);
const QuestionCountModel = mongoose.model("QuestionCountModel", QuestionCountSchema);

export { HistoryModel, QuestionCountModel };