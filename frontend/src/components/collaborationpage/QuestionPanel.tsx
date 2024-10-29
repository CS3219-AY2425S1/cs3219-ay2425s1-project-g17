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
    example?: ExampleProps[];
    categories: string[];
    complexity: string;
    popularity: number;
}

const getComplexityColor = (complexity: keyof typeof complexityColors) => {
    return complexityColors[complexity] || 'black';
};

const QuestionPanel: React.FC<QuestionPanelProps>  = ({
    id,
    title,
    description,
    example,
    categories,
    complexity,
    popularity
}) => {
    return (
        <Paper
            sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                height: '70vh',
                overflowY: 'auto',
            }}
        >
            <Typography variant="h6" component="h2" sx={{ color: 'white', marginBottom: 0.5 }}>
                {id + '. ' + title}
            </Typography>
            <Box
                sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}
            >
                <Typography
                    sx={{
                        color: getComplexityColor(complexity as keyof typeof complexityColors),
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginRight: 2,
                    }}
                >
                    {complexity}
                </Typography>

                <WhatshotIcon sx={{ color: 'orange', fontSize: 16, marginRight: 0.5 }} />
                <Typography
                    variant="body1"
                    sx={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }} 
                >
                    {popularity}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories?.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        sx={{ padding: '0px 6px', height: 18, fontSize: '12px' }} 
                    />
                ))}
            </Box>
            <Box sx={{ fontSize: '14px' }}> 
                <Markdown>
                    {description}
                </Markdown>
            </Box>
            <Box sx={{ mt: 2, color: 'white' }}>
                {example?.map((eg, index) => (
                    <Box key={eg.id} sx={{ mt: 2 }}>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Example {index + 1}
                        </Typography>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Input: {eg.input}
                        </Typography>
                        <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                            Output: {eg.output}
                        </Typography>
                        {eg.explanation && (
                            <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>
                                Explanation: {eg.explanation}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}

export default QuestionPanel;
