import React from 'react';
import { Box } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';

const complexities = [
    { label: 'None', color: '#FFFFFF' },
    { label: 'Easy', color: '#5AB8B9' },
    { label: 'Medium', color: '#F2BA40' },
    { label: 'Hard', color: '#E24A42' },
];

interface ExampleProps {
    id: number;
    input: string;
    output: string;
    explanation: string;
}
interface QuestionProps {
    _id: string;
    question_id: number;
    question_title: string;
    question_description: string;
    question_example: ExampleProps[];
    question_categories: string[];
    question_complexity: string;
    question_popularity: number;
}

interface QuestionsProps {
    questions: QuestionProps[];
}
// TODO: Implement results from backend
const AttemptedProgress: React.FC<QuestionsProps> = ({ questions }) => {
    const totalQuestions = questions?.reduce(
        (acc, question) => {
            switch (question.question_complexity) {
                case 'EASY':
                    acc.easy += 1;
                    break;
                case 'MEDIUM':
                    acc.medium += 1;
                    break;
                case 'HARD':
                    acc.hard += 1;
                    break;
                default:
                    break;
            }
            return acc;
        },
        { easy: 0, medium: 0, hard: 0 }
    );

    const attempts = {
        easy: 3,
        medium: 2,
        hard: 1,
    };

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                color: 'white',
                width: "50%",
                height: "40vh",
                alignContent: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgressWithLabel attempts={attempts} total={totalQuestions} complexities={complexities} />
        </Box>
    );
};

export default AttemptedProgress;
