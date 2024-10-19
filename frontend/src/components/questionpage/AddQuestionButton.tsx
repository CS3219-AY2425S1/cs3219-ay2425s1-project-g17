import * as React from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, Modal, Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel, ListItemText } from '@mui/material';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import { addQuestion, checkTitle } from '../../services/question-service/QuestionService';
import DeleteIcon from '@mui/icons-material/Delete';

const complexities = ['Easy', 'Medium', 'Hard'];

const dropdownMenuProps = {
    PaperProps: {
        sx: {
            maxHeight: 200,
        },
    },
};

interface AddQuestionButtonProps {
    categories: string[];
}

interface ExampleProps {
    id: number;
    input: string;
    output: string;
    explanation: string;

}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ categories }) => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState<string[]>([]);
    const [complexity, setComplexity] = React.useState<string>('');
    const [popularity, setPopularity] = React.useState<number>(0);
    const [example, setExample] = React.useState<ExampleProps[]>([]);
    const [exampleDeleteOpen, setExampleDeleteOpen] = React.useState(false);
    const [exampleToDelete, setExampleToDelete] = React.useState<number | null>(null);


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

        const titleExists = await checkTitle(title.trim());
        if (titleExists) {
            alert('Question title already exists. Please enter a different title.');
            return;
        }
        const newQuestion = await addQuestion(title, description, example, category, complexity, popularity);

        if (newQuestion) {
            window.location.reload();
        } else {
            alert('Failed to add question. Please try again.');
        }
        handleClose();
    };

    const handleExampleDeleteOpen = (index: number) => {
        setExampleToDelete(index);
        setExampleDeleteOpen(true);
    };

    const handleExampleDeleteClose = () => {
        setExampleToDelete(null);
        setExampleDeleteOpen(false);
    };

    const handleConfirmExampleDelete = () => {
        if (exampleToDelete !== null) {
            const updatedExamples = example.filter((_, i) => i !== exampleToDelete);
            setExample(updatedExamples);
            handleExampleDeleteClose();
        }
    };


    const handleAddExample = () => {
        const newExample: ExampleProps = { id: Date.now(), input: '', output: '', explanation: '' };
        setExample([...example, newExample]);
    };

    const handleExampleChange = (index: number, field: keyof ExampleProps, value: string) => {
        const updatedExamples = [...example];
        updatedExamples[index] = { ...updatedExamples[index], [field]: value };
        setExample(updatedExamples);
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
                Add
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
                        width: 500,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: "80vh",
                        overflowY: "auto"
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
                                        {selected?.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={dropdownMenuProps}
                                label="Category"
                            >
                                {categories?.map((cat) => (
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
                                {complexities?.map((comp) => (
                                    <MenuItem key={comp} value={comp.toUpperCase()}>
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

                        {example?.map((ex, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography sx={{ mb: 1, color: "white" }}>
                                Add Example {index + 1}
                            </Typography>
                            <TextField
                            required
                                fullWidth
                                label="Input"
                                value={ex.input}
                                onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                            required
                                fullWidth
                                label="Output"
                                value={ex.output}
                                onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Explanation"
                                value={ex.explanation}
                                onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Box sx={{ display: "flex", justifyContent: "right" }}>
                                <Button
                                    color="error"
                                    onClick={() => handleExampleDeleteOpen(index)}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>

                            </Box>

                        </Box>
                    ))}

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddExample}
                            sx={{ mb: 2, mt: 2 }}
                        >
                            Add Example
                        </Button>
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

            <Modal open={exampleDeleteOpen} onClose={handleExampleDeleteClose}>
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
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Delete example?
                    </Typography>
                    <Typography sx={{ mb: 4 }}>
                        Are you sure you want to delete this example? It will only take effect after clicking "Submit".
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                        <Button variant="outlined" onClick={handleExampleDeleteClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleConfirmExampleDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddQuestionButton;
