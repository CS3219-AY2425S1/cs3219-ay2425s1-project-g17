import * as React from 'react';
import { TableCell, TableRow, Typography, Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Explicitly define the type for complexityColors to ensure safe indexing
const complexityColors: Record<'EASY' | 'MEDIUM' | 'HARD', string> = {
    EASY: '#2C6B6D',
    MEDIUM: '#F3A32D',
    HARD: '#C73D4C',
};

interface QuestionCardProps {
    id: number;
    title: string;
    description: string;
    categories: string[];
    complexity: string;
    popularity: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    id,
    title,
    description,
    categories,
    complexity,
    popularity,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Function to get the corresponding color for the complexity level
    const getComplexityColor = (complexity: keyof typeof complexityColors) => {
        return complexityColors[complexity] || 'black'; // Default to black if not found
    };

    return (
        <>
            <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell
                    onClick={handleOpen}
                    sx={{
                        cursor: 'pointer',
                        color: 'white',
                        transition: 'color 0.3s',
                        '&:hover': {
                            color: '#1168f7',
                        },
                    }}
                >
                    {title}
                </TableCell>
                <TableCell>{categories.join(", ")}</TableCell>
                <TableCell
                    sx={{
                        color: getComplexityColor(complexity as keyof typeof complexityColors),
                        fontWeight: 'bold',
                    }}
                >
                    {complexity}
                </TableCell>
                <TableCell>{popularity}</TableCell>
            </TableRow>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
                        {id + ". " + title}
                    </Typography>
                    <Typography sx={{ mt: 2, color: 'white' }}>{description}</Typography>
                </Box>
            </Modal>
        </>
    );
};

export default QuestionCard;
