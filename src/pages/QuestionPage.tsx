import * as React from 'react';
import Navbar from '../components/Navbar';
import {
    Container,
    Box,
    Button,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import QuestionCard from '../components/QuestionCard';
import { getAllQuestions } from '../backend/question-service/QuestionService';
import AddQuestionButton from '../components/AddQuestionButton';

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
    const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
    const [filteredQuestions, setFilteredQuestions] = React.useState<QuestionProps[]>([]);
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
    const [selectedComplexity, setSelectedComplexity] = React.useState<ComplexityOption | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page whenever rows per page change
    };

    const categories = [
        "Array",
        "Algorithms",
        "Strings",
        "Hash Table",
        "Dynamic Programming",
        "Math",
        "Sorting",
        "Greedy",
        "Depth-First Search",
        "Database",
        "Binary Search",
        "Matrix",
        "Tree",
        "Breadth-First Search",
        "Bit Manipulation",
        "Two Pointers",
        "Binary Tree",
        "Heap (Priority Queue)",
        "Prefix Sum",
        "Simulation",
        "Stack",
        "Graph",
        "Counting",
        "Sliding Window",
        "Design",
        "Backtracking",
        "Enumeration",
        "Union Find",
        "Linked List",
        "Ordered Set",
        "Monotonic Stack",
        "Number Theory",
        "Trie",
        "Segment Tree",
        "Bitmask",
        "Divide and Conquer",
        "Queue",
        "Recursion",
        "Binary Search Tree",
        "Combinatorics",
        "Binary Indexed Tree",
        "Geometry",
        "Memoization",
        "Hash Function",
        "Topological Sort",
        "String Matching",
        "Shortest Path",
        "Game Theory",
        "Rolling Hash",
        "Interactive",
        "Data Stream",
        "Brainteaser",
        "Monotonic Queue",
        "Randomized",
        "Merge Sort",
        "Doubly-Linked List",
        "Iterator",
        "Concurrency",
        "Probability and Statistics",
        "Counting Sort",
        "Quickselect",
        "Suffix Array",
        "Bucket Sort",
        "Minimum Spanning Tree",
        "Shell",
        "Line Sweep",
        "Reservoir Sampling",
        "Strongly Connected Component",
        "Eulerian Circuit",
        "Radix Sort",
        "Rejection Sampling",
        "Biconnected Component",
        "Data Structures"
    ].sort();

    const complexities: ComplexityOption[] = [
        { label: 'None', color: '#FFFFFF' },
        { label: 'Easy', color: '#2C6B6D' },
        { label: 'Medium', color: '#F3A32D' },
        { label: 'Hard', color: '#C73D4C' },
    ];

    React.useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getAllQuestions();
                setQuestions(data);
                setFilteredQuestions(data); // Initialize filtered questions with all data
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        }
        fetchQuestions();
    }, []);

    React.useEffect(() => {
        const filterQuestions = () => {
            let filtered = questions;

            // Filter by categories: Only show questions that have all selected categories
            if (selectedCategories.length > 0) {
                filtered = filtered?.filter((question) =>
                    selectedCategories.every((category) =>
                        question.question_categories.includes(category)
                    )
                );
            }

            // Filter by complexity, excluding "None" from the filter
            if (selectedComplexity && selectedComplexity.label !== 'None') {
                filtered = filtered?.filter(
                    (question) => question.question_complexity.toUpperCase() === selectedComplexity.label.toUpperCase()
                );
            }

            // Filter by search query: Match question title or description
            if (searchQuery.trim()) {
                filtered = filtered?.filter((question) =>
                    question.question_title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            setFilteredQuestions(filtered);
        };

        filterQuestions();
    }, [questions, selectedCategories, selectedComplexity, searchQuery]);

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
                }}
            >
                <Container
                    maxWidth="xl"
                    sx={{
                        backgroundColor: 'background.default',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ paddingTop: '20px', display: 'flex', gap: 2, alignItems: 'center' }}>
                        <AddQuestionButton categories={categories}/>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', fontWeight: isEditMode ? 'bold' : 'normal' }}
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? 'Done' : 'Edit'}
                        </Button>

                        <Autocomplete
                            multiple
                            size="small"
                            options={categories}
                            value={selectedCategories}
                            onChange={(event, newValue) => setSelectedCategories(newValue)}
                            renderInput={(params) => <TextField {...params} label="Category" />}
                            sx={{ minWidth: 150, maxWidth: 400 }}
                        />

                        <Autocomplete
                            size="small"
                            options={complexities}
                            value={selectedComplexity}
                            onChange={(event, newValue) => setSelectedComplexity(newValue)}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => <TextField {...params} label="Complexity" />}
                            sx={{ minWidth: 150, maxWidth: 400 }}
                            renderOption={(props, option) => (
                                <li {...props} style={{ color: option.color }}>
                                    {option.label}
                                </li>
                            )}
                        />

                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon sx={{ color: 'white' }} />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                                sx={{ color: 'white' }}
                                autoFocus
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
                                    {filteredQuestions
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((question) => (
                                            <QuestionCard
                                                key={question._id}
                                                id={question.question_id}
                                                title={question.question_title}
                                                description={question.question_description}
                                                categories={question.question_categories}
                                                complexity={question.question_complexity}
                                                popularity={question.question_popularity}
                                                isEditMode={isEditMode}
                                                allCategories={categories}
                                            />
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination controls */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredQuestions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Container>
            </Container>
        </>
    );
}

export default QuestionPage;