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
    Typography
} from '@mui/material';
import QuestionCard from './QuestionCard';

interface QuestionProps {
    _id: string;
    question_id: number;
    question_title: string;
    question_description: string;
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
}

const QuestionTable: React.FC<QuestionTableProps> = ({
    filteredQuestions,
    categories,
    page,
    rowsPerPage,
    isEditMode,
    handleChangePage,
    handleChangeRowsPerPage
}) => {
    return (
        <div>
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

            {(filteredQuestions?.length === 0 || !filteredQuestions) && (
                <Typography variant="h6" align="center" sx={{ marginTop: 4, color: "text.secondary" }}>
                    There are no questions found.
                </Typography>
            )}

            {/* Pagination controls */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredQuestions ? filteredQuestions.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default QuestionTable;
