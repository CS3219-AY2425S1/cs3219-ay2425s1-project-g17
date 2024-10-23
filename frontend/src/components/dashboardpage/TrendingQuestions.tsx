import React from 'react';
import { Typography, Box, Paper, Chip } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';

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

interface TrendingQuestionsProps {
    questions: QuestionProps[];
}

const TrendingQuestionsPage: React.FC<TrendingQuestionsProps> = ({ questions }) => {

    const sortedQuestions = questions?.sort((a, b) => b.question_popularity - a.question_popularity).slice(0, 7);

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                color: 'white',
                width: "50%",
                height: "40vh",
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'white', fontSize: '18px' }}>
                Trending Questions
            </Typography>

            <Box
                sx={{
                    overflowY: 'auto',
                    height: "30vh",
                }}
            >
                {sortedQuestions?.map((question) => (
                    <Paper
                        key={question.question_id}
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: 'background.default',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 1,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{

                                    color: 'primary.main',
                                    fontSize: '16px',
                                }}
                            >
                                {question.question_id}. {question.question_title}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <WhatshotIcon sx={{ color: 'orange', fontSize: 16, marginRight: 0.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>
                                    {question.question_popularity}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {question.question_categories.map((category, idx) => (
                                <Chip
                                    key={idx}
                                    label={category}
                                    sx={{
                                        padding: '0px 6px',
                                        height: 21,
                                        bgcolor: 'secondary.main',
                                        color: 'white',
                                        fontSize: '12px',
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default TrendingQuestionsPage;
