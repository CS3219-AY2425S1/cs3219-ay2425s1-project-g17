import * as React from 'react';
import {
    TableCell,
    TableRow,
    Typography,
    Modal,
    Box,
    IconButton,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateQuestion, deleteQuestion } from '../backend/question-service/QuestionService';
import Chip from '@mui/material/Chip';

const allCategories = [
    "Array", "Algorithms", "Strings", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Greedy",
    "Depth-First Search", "Database", "Binary Search", "Matrix", "Tree",
    "Breadth-First Search", "Bit Manipulation", "Two Pointers", "Binary Tree",
    "Heap (Priority Queue)", "Prefix Sum", "Simulation", "Stack", "Graph",
    "Counting", "Sliding Window", "Design", "Backtracking", "Enumeration",
    "Union Find", "Linked List", "Ordered Set", "Monotonic Stack", "Number Theory",
    "Trie", "Segment Tree", "Bitmask", "Divide and Conquer", "Queue", "Recursion",
    "Binary Search Tree", "Combinatorics", "Binary Indexed Tree", "Geometry",
    "Memoization", "Hash Function", "Topological Sort", "String Matching",
    "Shortest Path", "Game Theory", "Rolling Hash", "Interactive", "Data Stream",
    "Brainteaser", "Monotonic Queue", "Randomized", "Merge Sort", "Doubly-Linked List",
    "Iterator", "Concurrency", "Probability and Statistics", "Counting Sort",
    "Quickselect", "Suffix Array", "Bucket Sort", "Minimum Spanning Tree", "Shell",
    "Line Sweep", "Reservoir Sampling", "Strongly Connected Component",
    "Eulerian Circuit", "Radix Sort", "Rejection Sampling", "Biconnected Component", "Data Structures"
];

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
    isEditMode: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    id,
    title,
    description,
    categories,
    complexity,
    popularity,
    isEditMode,
}) => {
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(title);
    const [editedDescription, setEditedDescription] = React.useState(description);
    const [editedCategories, setEditedCategories] = React.useState<string[]>(categories);
    const [editedComplexity, setEditedComplexity] = React.useState(complexity);
    const [editedPopularity, setEditedPopularity] = React.useState(popularity);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    const getComplexityColor = (complexity: keyof typeof complexityColors) => {
        return complexityColors[complexity] || 'black';
    };

    const handleEditSubmit = async () => {
        try {
            await updateQuestion(
                id,
                editedTitle,
                editedDescription,
                editedCategories,
                editedComplexity,
                editedPopularity,
            );
            console.log('Question updated successfully');
            setEditOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to update the question:', error);
        }
    };

    // TODO: Change window confirm to modal
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this question?');
        if (confirmDelete) {
            try {
                await deleteQuestion(id);
                alert('Question deleted successfully.');
                window.location.reload();
            } catch (error) {
                alert('Failed to delete the question.');
            }
        }
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
                <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {categories.map((category) => (
                            <Chip key={category} label={category} />
                        ))}
                    </Box>
                </TableCell>
                <TableCell
                    sx={{
                        color: getComplexityColor(editedComplexity as keyof typeof complexityColors),
                        fontWeight: 'bold',
                    }}
                >
                    {complexity}
                </TableCell>
                <TableCell>{popularity}</TableCell>

                {isEditMode && (
                    <TableCell>
                        <IconButton color="primary" size="small" onClick={handleEditOpen}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={handleDelete}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </TableCell>
                )}
            </TableRow>

            {/* View Modal */}
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
                        {id + '. ' + editedTitle}
                    </Typography>
                    <Typography sx={{ mt: 2, color: 'white' }}>{editedDescription}</Typography>
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal open={editOpen} onClose={handleEditClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Edit Question
                    </Typography>
                    <TextField
                        fullWidth
                        label="Title"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
    <InputLabel>Categories</InputLabel>
    <Select
        multiple
        value={editedCategories}
        onChange={(e) => setEditedCategories(e.target.value as string[])}
        renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                    <Chip key={value} label={value} />
                ))}
            </Box>
        )}
        label="Categories"
        MenuProps={{
            PaperProps: {
                sx: {
                    maxHeight: 200,
                },
            },
        }}
    >
        {
            // Sort categories with selected ones at the top
            [...allCategories]
                .sort((a, b) => {
                    const aSelected = editedCategories.includes(a);
                    const bSelected = editedCategories.includes(b);
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return a.localeCompare(b);
                })
                .map((cat) => (
                    <MenuItem key={cat} value={cat}>
                        {cat}
                    </MenuItem>
                ))
        }
    </Select>
</FormControl>


                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Complexity</InputLabel>
                        <Select
                            value={editedComplexity}
                            label="Complexity"
                            onChange={(e) => setEditedComplexity(e.target.value as string)}
                        >
                            <MenuItem value="EASY">Easy</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HARD">Hard</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="number"
                        label="Popularity"
                        value={editedPopularity}
                        onChange={(e) => setEditedPopularity(Number(e.target.value))}
                        sx={{ mb: 2 }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 3,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleEditSubmit}
                            sx={{ mr: 2, color: 'white' }}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outlined" onClick={handleEditClose}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </>
    );
};

export default QuestionCard;
