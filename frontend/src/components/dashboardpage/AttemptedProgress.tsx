import React from 'react';
import { Box } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';

const complexities = [
    { label: 'None', color: '#FFFFFF' },
    { label: 'Easy', color: '#5AB8B9' },
    { label: 'Medium', color: '#F2BA40' },
    { label: 'Hard', color: '#E24A42' },
];
// TODO: Implement results from backend
const AttemptedProgress: React.FC = () => {
    const totalQuestions = {
        easy: 50,
        medium: 30,
        hard: 20,
    };
    const attempts = {
        easy: 30,
        medium: 20,
        hard: 10,
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
