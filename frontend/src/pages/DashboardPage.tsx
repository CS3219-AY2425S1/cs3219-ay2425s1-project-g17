import * as React from 'react';
import {
    Container,
    Box,
    Autocomplete,
    TextField,
    Typography,
} from '@mui/material';
import { getAllQuestions, getFilteredQuestions, getAvailableCategories } from '../services/question-service/QuestionService';
import SearchBar from '../components/questionpage/SearchBar';
import QuestionTable from '../components/questionpage/QuestionTable';
import MatchingComponent from '../components/MatchingComponent';

interface ComplexityOption {
    label: string;
    color: string;
}

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

function DashboardPage() {
    const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
    const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
    const [selectedComplexity, setSelectedComplexity] = React.useState<ComplexityOption | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [availableCategories, setAvailableCategories] = React.useState<string[]>([]);

    const username = localStorage.getItem('username');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        }

        async function fetchFilteredQuestions() {
            try {
                const data = await getFilteredQuestions(
                    selectedCategories,
                    selectedComplexity ? selectedComplexity.label : null,
                    searchQuery
                );
                setQuestions(data);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            }
        }

        async function getCategories() {
            try {
                const data = await getAvailableCategories();
                setAvailableCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }

        getCategories();
        fetchQuestions();
        fetchFilteredQuestions();
    }, [selectedCategories, selectedComplexity, searchQuery]);

    return (
        <>
            <Container
                maxWidth={false}
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <Typography variant="h5" align="left" sx={{ mt: 4, ml: 3 }}>
                    <b>Hi, Welcome back {username}!</b>
                </Typography>
                <Container
                    maxWidth={false}
                    sx={{
                        backgroundColor: 'background.default',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >

                    <Box sx={{
                        flexDirection: 'row',
                        flex: 1,
                        pt: "20px"
                    }}>
                        <MatchingComponent />
                    </Box>

                    <Container
                        maxWidth="xl"
                        sx={{
                            backgroundColor: 'background.default',
                            minHeight: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 3
                        }}
                    >

                        <Box sx={{ paddingTop: '20px', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Autocomplete
                                multiple
                                size="small"
                                options={availableCategories}
                                value={selectedCategories}
                                onChange={(event, newValue) => setSelectedCategories(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Category"
                                        sx={{
                                            minWidth: 150,
                                            maxWidth: 400,
                                            "& label": {
                                                color: "primary.main",
                                            },
                                            "& label.Mui-focused": {
                                                color: "primary.main",
                                            }
                                        }}
                                    />
                                )}
                                sx={{ minWidth: 150, maxWidth: 400 }}
                            />

                            <Autocomplete
                                size="small"
                                options={complexities}
                                value={selectedComplexity}
                                onChange={(event, newValue) => setSelectedComplexity(newValue)}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Complexity"
                                        sx={{
                                            minWidth: 150,
                                            maxWidth: 400,
                                            "& label": {
                                                color: "primary.main",
                                            },
                                            "& label.Mui-focused": {
                                                color: "primary.main",
                                            }
                                        }}
                                    />
                                )}
                                sx={{ minWidth: 150, maxWidth: 400 }}
                                renderOption={(props, option) => (
                                    <li {...props} style={{ color: option.color }}>
                                        {option.label}
                                    </li>
                                )}
                            />

                            {/* Search Bar Component */}
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                        </Box>

                        {/* Question Table Component */}
                        <Box sx={{ paddingTop: '20px' }}>
                            <QuestionTable
                                filteredQuestions={questions}
                                categories={categories}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                isEditMode={false}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </Box>

                    </Container>
                </Container>
            </Container>
        </>
    );
}

export default DashboardPage;