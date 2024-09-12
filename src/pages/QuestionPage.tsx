import * as React from 'react';
import Navbar from '../components/Navbar';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Container, Box, Button, Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import QuestionCard from '../components/QuestionCard';
import { getAllQuestions } from '../backend/question-service/QuestionService';

interface ComplexityOption {
    label: string;
    color: string;
}

interface QuestionProps {
    _id: string;
    question_id: number;
    question_title: string;
    question_description: string;
    question_categories: string[];
    question_complexity: string;
    question_popularity: number;
}

function QuestionPage() {

    // TODO: Fetch questions from API
    const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
    const categories = ['String', 'Algorithms', 'Databases', 'Brainteaser'];

    React.useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getAllQuestions();
                setQuestions(data);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        }
        fetchQuestions();
    }, []);

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '30ch',
            },
        },
    }));

    const complexities: ComplexityOption[] = [
        { label: 'Easy', color: '#2C6B6D' },
        { label: 'Medium', color: '#F3A32D' },
        { label: 'Hard', color: '#C73D4C' }
    ];

    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
    const [selectedComplexities, setSelectedComplexities] = React.useState<ComplexityOption[]>([]);

    return (
        <>
            <Navbar />
            <Container
                maxWidth={false}
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <Container
                    maxWidth="xl"
                    sx={{
                        backgroundColor: 'background.default',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>

                    <Box
                        sx={{ paddingTop: '20px', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddBoxIcon />}
                            sx={{ color: 'white' }}
                        >
                            Add Question
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white' }}
                        >
                            Edit
                        </Button>

                        <Autocomplete
                            multiple
                            size="small"
                            options={categories}
                            value={selectedCategories}
                            onChange={(event, newValue) => setSelectedCategories(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Category" />
                            )}
                            sx={{ minWidth: 150, maxWidth: 400 }}
                        />

                        <Autocomplete
                            multiple
                            size="small"
                            options={complexities}
                            value={selectedComplexities}
                            onChange={(event, newValue) => setSelectedComplexities(newValue)}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField {...params} label="Complexity" />
                            )}
                            sx={{ minWidth: 150, maxWidth: 400 }}
                            renderOption={(props, option) => (
                                <li {...props} style={{ color: option.color }}>
                                    {option.label}
                                </li>
                            )}
                        />

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon sx={{ color: "white" }} />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                sx={{ color: 'white' }}
                            />
                        </Search>
                    </Box>

                    <Box sx={{ paddingTop: '20px' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Complexity</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Popularity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {questions.map((question) => (
                                        <QuestionCard key={question._id}
                                            id={question.question_id}
                                            title={question.question_title}
                                            description={question.question_description}
                                            categories={question.question_categories}
                                            complexity={question.question_complexity}
                                            popularity={question.question_popularity}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                </Container>
            </Container>
        </>
    );
}

export default QuestionPage;