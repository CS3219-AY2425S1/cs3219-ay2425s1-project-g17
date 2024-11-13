import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import QuestionCard from './QuestionCard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { sortQuestion } from '../../services/question-service/QuestionService';

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

interface QuestionTableProps {
    filteredQuestions: QuestionProps[];
    categories: string[];
    page: number;
    rowsPerPage: number;
    isEditMode: boolean;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleQuestionUpdate: () => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
    filteredQuestions,
    categories,
    page,
    rowsPerPage,
    isEditMode,
    handleChangePage,
    handleChangeRowsPerPage,
    handleQuestionUpdate
}) => {
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [sortField, setSortField] = React.useState<string>('question_id');
    const [sortedQuestions, setSortedQuestions] = React.useState<QuestionProps[]>(filteredQuestions);

    React.useEffect(() => {
        setSortedQuestions(filteredQuestions);
    }, [filteredQuestions]);

    const handleSort = (field: string) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        setSortField(field);

        sortQuestion(filteredQuestions, newDirection, field).then(sortedQuestions => {
            setSortedQuestions(sortedQuestions);
        });
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('question_id')}>
                                <Box display="flex" alignItems="center">
                                    No
                                    <IconButton size="small">
                                        {sortField === 'question_id' && sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('question_title')}>
                                <Box display="flex" alignItems="center">
                                    Title
                                    <IconButton size="small">
                                        {sortField === 'question_title' && sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('question_complexity')}>
                                <Box display="flex" alignItems="center">
                                    Complexity
                                    <IconButton size="small">
                                        {sortField === 'question_complexity' && sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleSort('question_popularity')}>
                                <Box display="flex" alignItems="center">
                                    Popularity
                                    <IconButton size="small">
                                        {sortField === 'question_popularity' && sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedQuestions
                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((question) => (
                                <QuestionCard
                                    key={question._id}
                                    id={question.question_id}
                                    title={question.question_title}
                                    description={question.question_description}
                                    example={question.question_example}
                                    categories={question.question_categories}
                                    complexity={question.question_complexity}
                                    popularity={question.question_popularity}
                                    isEditMode={isEditMode}
                                    allCategories={categories}
                                    handleQuestionUpdate={handleQuestionUpdate}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {(sortedQuestions?.length === 0 || !sortedQuestions) && (
                <Typography variant="h6" align="center" sx={{ marginTop: 4, color: "text.secondary" }}>
                    There are no questions found.
                </Typography>
            )}

            {/* Pagination controls */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedQuestions ? sortedQuestions.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default QuestionTable;
