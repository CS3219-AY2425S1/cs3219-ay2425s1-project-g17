import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tooltip,
    IconButton,
    Modal,
    Box,
    Chip,
    Divider,
    TablePagination
} from '@mui/material';
import { formatDistanceToNow, format, differenceInMinutes } from 'date-fns';
import SourceIcon from '@mui/icons-material/Source';
import CloseIcon from '@mui/icons-material/Close';
import { getHistoryById } from '../../services/history-service/HistoryService';
import { getQuestionById } from '../../services/question-service/QuestionService';
import { getUsernameById } from '../../services/user-service/UserService';

const complexityColors: Record<string, string> = {
    'EASY': '#2C6B6D',
    'MEDIUM': '#F3A32D',
    'HARD': '#C73D4C'
};

interface BackendData {
    userId: string;
    partnerId: string;
    questionId: string;
    startTime: string;
    attempt: string;
    endTime: string;
}

interface HistoryEntry {
    no: number;
    partner: string;
    title: string;
    categories: string[];
    complexity: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    code: string;
}

interface HistoryTableProps {
    userId: string;
    token: string;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ userId, token }) => {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [selectedEntry, setSelectedEntry] = React.useState<HistoryEntry | null>(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [historyData, setHistoryData] = React.useState<HistoryEntry[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const fetchHistoryById = async (id: string) => {
        try {
            const data = await getHistoryById(id);
            return data;
        } catch (error) {
            console.error(`Failed to fetch history with id: ${id}`, error);
        }
    };

    const fetchPartnerUsername = async (partnerId: string) => {
        try {
            const data = await getUsernameById(partnerId, token);
            return data;
        } catch (error) {
            console.error(`Failed to fetch username with id: ${partnerId}`, error);
        }
    };

    const fetchQuestionDetails = async (questionId: string) => {
        try {
            const data = await getQuestionById(questionId);
            return data;
        } catch (error) {
            console.error(`Failed to fetch question with id: ${questionId}`, error);
        }
    };

    const processBackendData = async (id: string) => {
        const historyData = await fetchHistoryById(id);
        const processedData = await Promise.all(
            (historyData?.data || []).map(async (item: BackendData, index: number) => {
                const partnerUsername = await fetchPartnerUsername(item.partnerId);
                const questionDetails = await fetchQuestionDetails(item.questionId);
    
                return {
                    no: index + 1,
                    partner: partnerUsername?.data || "Unknown",
                    title: questionDetails?.question_title || "Unknown",
                    categories: questionDetails?.question_categories || [],
                    complexity: questionDetails?.question_complexity || "Unknown",
                    startTime: new Date(item.startTime),
                    endTime: new Date(item.endTime),
                    duration: differenceInMinutes(item.endTime, item.startTime),
                    code: item.attempt || ''
                };
            })
        );
    
        setHistoryData(processedData);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                await processBackendData(userId);
            }
        };
        fetchData();
    
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatTimestamp = (endTime: Date) => {
        const relativeTime = formatDistanceToNow(endTime, { addSuffix: true });
        return relativeTime;
    };

    const handleCodeClick = (entry: HistoryEntry) => {
        setSelectedEntry(entry);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedEntry(null);
    };

    const getComplexityColor = (complexity: string) => {
        return complexityColors[complexity] || 'black';
    };

    const formatDateTime = (date: Date) => {
        return format(date, "MMM d, yyyy HH:mm");
    };

    const displayedHistory = historyData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <Paper
                sx={{
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    marginTop: '15px',
                    bgcolor: 'background.paper'
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                    <b>History</b>
                </Typography>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="history table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>No</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Partner</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Categories</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Complexity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Code</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedHistory.map((row) => (
                                <TableRow
                                    key={row.no}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell sx={{ color: 'white' }}>{row.no}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{row.partner}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{row.title}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(row.categories || []).map((category) => (
                                                <Chip key={category} label={category} />
                                            ))}
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            color: getComplexityColor(row.complexity),
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {row.complexity}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Tooltip title="View Code">
                                                <IconButton 
                                                    size="small"
                                                    onClick={() => handleCodeClick(row)}
                                                    sx={{ 
                                                        ml: 1,
                                                        color: 'white',
                                                        '&:hover': {
                                                            color: '#1168f7',
                                                        },
                                                    }}
                                                >
                                                    <SourceIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip 
                                            title={row.endTime.toLocaleString()} 
                                            placement="left"
                                        >
                                            <span style={{ color: 'white' }}>
                                                {formatTimestamp(row.endTime)}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {historyData.length === 0 && (
                    <Typography variant="h6" align="center" sx={{ marginTop: 4, color: "text.secondary" }}>
                        No history found.
                    </Typography>
                )}

                {/* Add TablePagination component */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={historyData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Code Modal */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="code-modal"
                aria-describedby="code-content"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedEntry && (
                        <>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', mb: 1 }}>
                                {selectedEntry.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                                Start: {formatDateTime(selectedEntry.startTime)} | 
                                End: {formatDateTime(selectedEntry.endTime)} |
                                Duration: {selectedEntry.duration} mins | 
                                Partner: {selectedEntry.partner}
                            </Typography>
                            <Divider sx={{ mb: 2, bgcolor: 'gray' }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    color: 'white',
                                    backgroundColor: '#333',
                                    p: 2,
                                    borderRadius: 2,
                                    fontFamily: 'monospace'
                                }}
                            >
                                {selectedEntry.code}
                            </Typography>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default HistoryTable;