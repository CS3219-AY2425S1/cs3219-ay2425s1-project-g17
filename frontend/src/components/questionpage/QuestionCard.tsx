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
    Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { updateQuestion, deleteQuestion, checkTitle } from '../../services/question-service/QuestionService';
import Chip from '@mui/material/Chip';
import Markdown from 'react-markdown'

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

interface QuestionCardProps {
    id: number;
    title: string;
    description: string;
    example: ExampleProps[];
    categories: string[];
    complexity: string;
    popularity: number;
    isEditMode: boolean;
    allCategories: string[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    id,
    title,
    description,
    example,
    categories,
    complexity,
    popularity,
    isEditMode,
    allCategories
}) => {
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState(title);
    const [editedDescription, setEditedDescription] = React.useState(description);
    const [editedExample, setEditedExample] = React.useState<ExampleProps[]>(example);
    const [editedCategories, setEditedCategories] = React.useState<string[]>(categories);
    const [editedComplexity, setEditedComplexity] = React.useState(complexity);
    const [editedPopularity, setEditedPopularity] = React.useState(popularity);
    const [exampleDeleteOpen, setExampleDeleteOpen] = React.useState(false);
    const [exampleToDelete, setExampleToDelete] = React.useState<number | null>(null);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);

    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => setDeleteOpen(false);

    const getComplexityColor = (complexity: keyof typeof complexityColors) => {
        return complexityColors[complexity] || 'black';
    };

    const handleEditSubmit = async () => {
        try {
            const doesTitleExist = await checkTitle(editedTitle.trim());
            if (doesTitleExist && editedTitle !== title) {
                alert('Title already exists. Please choose a different title.');
                return;
            } else {
                await updateQuestion(
                    id,
                    editedTitle,
                    editedDescription,
                    editedExample,
                    editedCategories,
                    editedComplexity,
                    editedPopularity,
                );
                alert('Question updated successfully');
                setEditOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert('Failed to update question. Error: ' + error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteQuestion(id);
            alert('Question deleted successfully.');
            setDeleteOpen(false);
            window.location.reload();
        } catch (error) {
            alert('Failed to delete the question. Error: ' + error);
        }
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
            const updatedExamples = editedExample.filter((_, i) => i !== exampleToDelete);
            setEditedExample(updatedExamples);
            handleExampleDeleteClose();
        }
    };

    const handleExampleChange = (index: number, field: keyof ExampleProps, value: string) => {
        const updatedExamples = [...editedExample];
        updatedExamples[index] = { ...updatedExamples[index], [field]: value };
        setEditedExample(updatedExamples);
    };

    const handleAddExample = () => {
        const newExample: ExampleProps = { id: Date.now(), input: '', output: '', explanation: '' };
        setEditedExample([...editedExample, newExample]);
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
                        {categories?.map((category) => (
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
                        <IconButton color="error" size="small" onClick={handleDeleteOpen}>
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
                        width: 550,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        maxHeight: '80vh',
                        overflowY: 'auto',
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
                        {id + '. ' + title}
                    </Typography>
                    <div>
                    <Markdown>{editedDescription}</Markdown>
                        <Typography sx={{ mt: 2, color: 'white' }}>
                            {example?.map((example, index) => (
                                <div key={index}>
                                    <Typography sx={{ mt: 2, color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Example {index + 1}
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Input: {example.input}
                                    </Typography>
                                    <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Output: {example.output}
                                    </Typography>
                                    {example.explanation && <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Explanation: {example.explanation}
                                    </Typography>}
                                </div>
                            ))}
                        </Typography>
                    </div>
                </Box>
            </Modal>

            {/* Edit Modal */}
            <Modal open={editOpen} onClose={handleEditClose}>
                <Box
                component="form"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 550,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit();
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: "white" }}>
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
                        <Autocomplete
                            multiple
                            options={allCategories}
                            value={editedCategories}
                            onChange={(event, newValue) => setEditedCategories(newValue)}
                            filterSelectedOptions
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField {...params} label="Categories" placeholder="Categories" />
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Complexity</InputLabel>
                        <Select
                            label="Complexity"
                            value={editedComplexity}
                            onChange={(e) => setEditedComplexity(e.target.value)}
                        >
                            <MenuItem value="EASY">EASY</MenuItem>
                            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                            <MenuItem value="HARD">HARD</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="number"
                        label="Popularity"
                        value={editedPopularity}
                        onChange={(e) => setEditedPopularity(Number(e.target.value))}/>

                    {editedExample?.map((ex, index) => (
                        <Box key={index} sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 1, color: "white" }}>
                                Edit Example {index + 1}
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
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddExample}
                        sx={{ mb: 2 }}
                    >
                        Add Example
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                        <Button variant="outlined" onClick={handleEditClose}>
                            Cancel
                        </Button>
                        <Button
                        type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{ mr: 2, color: 'white' }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Modal */}
            <Modal open={deleteOpen} onClose={handleDeleteClose}>
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
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: "white" }}>
                        Delete question?
                    </Typography>
                    <Typography sx={{ mb: 3, color: "white" }}>
                        This action can't be undone.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                        <Button variant="outlined" onClick={handleDeleteClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Delete
                        </Button>
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
                        Are you sure you want to delete this example? It will only take effect after clicking "save changes".
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

export default QuestionCard;
