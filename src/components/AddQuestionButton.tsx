import * as React from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, Modal, Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, ListItemText } from '@mui/material';
import Chip from '@mui/material/Chip';
import { addQuestion } from '../backend/question-service/QuestionService';

const categories = [
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

const complexities = ['Easy', 'Medium', 'Hard'];

const dropdownMenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 200,
        },
    },
};

const AddQuestionButton: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState<string[]>([]);
    const [complexity, setComplexity] = React.useState<string>('');
    const [popularity, setPopularity] = React.useState<number>(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (!title) {
            alert('Please enter a title.');
            return;
        } else if (!description) {
            alert('Please enter a description.');
            return;
        } else if (!category.length) {
            alert('Please select at least one category.');
            return;
        } else if (!complexity) {
            alert('Please select a complexity level.');
            return;
        } else if (popularity < 0) {
            alert('Please enter a valid popularity.');
            return;
        } 

        console.log({
            title,
            description,
            category,
            complexity,
            popularity
        });

        // TODO: Add error handling (duplicates)

        const newQuestion = await addQuestion(title, description, category, complexity, popularity);

        if (newQuestion) {
            alert('Question added successfully!');
            window.location.reload();
        } else {
            alert('Failed to add question. Please try again.');
        }
        handleClose();
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<AddBoxIcon />}
                sx={{ color: 'white' }}
                onClick={handleOpen}
            >
                Add Question
            </Button>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Add New Question
                    </Typography>
                    <Box
                        component="form"
                        sx={{ mt: 2 }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Title"
                            variant="outlined"
                            margin="normal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            required
                            fullWidth
                            label="Description"
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                multiple
                                value={category}
                                onChange={(e) => setCategory(e.target.value as string[])}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={dropdownMenuProps}
                                label="Category"
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        <ListItemText primary={cat} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Complexity</InputLabel>
                            <Select
                                required
                                value={complexity}
                                onChange={(e) => setComplexity(e.target.value as string)}
                                label="Complexity"
                                MenuProps={dropdownMenuProps}
                            >
                                {complexities.map((comp) => (
                                    <MenuItem key={comp.toUpperCase()} value={comp}>
                                        {comp}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Popularity"
                            variant="outlined"
                            margin="normal"
                            type="number"
                            value={popularity}
                            onChange={(e) => setPopularity(Number(e.target.value))}
                        />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                sx={{ color: 'white' }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddQuestionButton;
