import { Typography, Box, Paper } from '@mui/material';
import Markdown from 'react-markdown';
import Chip from '@mui/material/Chip';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const complexityColors: Record<'EASY' | 'MEDIUM' | 'HARD', string> = {
    EASY: '#2C6B6D',
    MEDIUM: '#F3A32D',
    HARD: '#C73D4C',
};

interface ExampleProps {
    id: number;
    input: string;
    output: string;
    explanation: string;
}

interface QuestionPanelProps {
    id: number;
    title: string;
    description: string;
    example: ExampleProps[];
    categories: string[];
    complexity: string;
    popularity: number;
}

// TODO: Get Question from question-service
const fakeQuestionPanelData: QuestionPanelProps = {
    id: 1,
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: [
        {
            id: 0,
            input: "[2, 7, 11, 15], target = 9",
            output: "[0, 1]",
            explanation: "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
        },
        {
            id: 1,
            input: "[3, 2, 4], target = 6",
            output: "[1, 2]",
            explanation: "Because nums[1] + nums[2] = 2 + 4 = 6, we return [1, 2]."
        }
    ],
    categories: ["Array", "Hash Table"],
    complexity: "EASY",
    popularity: 20,
};

const getComplexityColor = (complexity: keyof typeof complexityColors) => {
    return complexityColors[complexity] || 'black';
};

const QuestionPanel = () => {
    return (
        <Paper
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                height: '90vh',
                overflowY: 'auto',
            }}
        >
            <Typography variant="h6" component="h2" sx={{ color: 'white', marginBottom: 0.5 }}>
                {fakeQuestionPanelData.id + '. ' + fakeQuestionPanelData.title}
            </Typography>
            <Box
                sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}
            >
                <Typography
                    sx={{
                        color: getComplexityColor(fakeQuestionPanelData.complexity as keyof typeof complexityColors),
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginRight: 2,
                    }}
                >
                    {fakeQuestionPanelData.complexity}
                </Typography>

                <WhatshotIcon sx={{ color: 'orange', fontSize: 16, marginRight: 0.5 }} />
                <Typography
                    variant="body1"
                    sx={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }} 
                >
                    {fakeQuestionPanelData.popularity}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {fakeQuestionPanelData.categories?.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        sx={{ padding: '0px 6px', height: 18, fontSize: '10px' }} 
                    />
                ))}
            </Box>
            <Box sx={{ fontSize: '14px' }}> 
                <Markdown>
                    {fakeQuestionPanelData.description}
                </Markdown>
            </Box>
            <Box sx={{ mt: 2, color: 'white' }}>
                {fakeQuestionPanelData.example?.map((example) => (
                    <Box key={example.id} sx={{ mt: 2 }}>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Example {example.id + 1}
                        </Typography>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Input: {example.input}
                        </Typography>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Output: {example.output}
                        </Typography>
                        {example.explanation && (
                            <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                                Explanation: {example.explanation}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default QuestionPanel;
