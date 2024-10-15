import React, { useState, useEffect, useRef } from 'react';
import {
    Paper,
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    Autocomplete,
    Modal,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { sendMatchRequest, pollMatchStatus } from '../services/matching-service/MatchingService';
import { getAvailableCategories } from '../services/question-service/QuestionService';
import { useNavigate } from 'react-router-dom';

const MatchingComponent = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<string | null>('');
    const [difficulty, setDifficulty] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [timer, setTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [matchStatus, setMatchStatus] = useState<'searching' | 'success' | 'timeout' | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null); 
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [open, setOpen] = React.useState(false);
    const [snackbarCategoryOpen, setSnackbarCategoryOpen] = React.useState(false);
    const [snackbarDifficultyOpen, setSnackbarDifficultyOpen] = React.useState(false);

    useEffect(() => {
        getAvailableCategories()
            .then((categories) => setAvailableCategories(categories))
            .catch((error) => console.error("Error:", error));
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        resetMatch();
    };
    const handleSnackbarCategoryOpen = () => setSnackbarCategoryOpen(true);
    const handleSnackbarCategoryClose = () => setSnackbarCategoryOpen(false);
    const handleSnackbarDifficultyOpen = () => setSnackbarDifficultyOpen(true);
    const handleSnackbarDifficultyClose = () => setSnackbarDifficultyOpen(false);

    const handleSendRequest = async () => {
        const userId = localStorage.getItem('id');
        if (!userId) {
            setResultMessage('Please enter a valid User ID.');
            return;
        }
        if (!category) {
            handleSnackbarCategoryOpen();
            return;
        }
        if (!difficulty) {
            handleSnackbarDifficultyOpen();
            return;
        }

        setIsLoading(true);
        handleOpen();
        try {
            await sendMatchRequest(userId, category, difficulty);
            setResultMessage('Sit tight while we find a match for you...');
            setMatchStatus('searching');
            pollForMatch(userId);
            startTimer();
        } catch (error: any) {
            setResultMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const pollForMatch = (userId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const matchData = await pollMatchStatus(userId);
                if (matchData.matched) {
                    setResultMessage(`Successfully matched with ${matchData.partnerId}, you will be attempting a ${matchData.difficultyAssigned} question on ${matchData.categoryAssigned}`);
                    clearInterval(pollInterval);
                    if (timerIntervalRef.current) {
                        clearInterval(timerIntervalRef.current);
                    }
                    setMatchStatus('success');
                    startCountdown(5); 
                }
            } catch (error: any) {
                setResultMessage(error.message);
                clearInterval(pollInterval);
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                }
            }
        }, 2000);
    };

    const startTimer = () => {
        setTimer(0);
        const timerInterval = setInterval(() => {
            setTimer((prevTime) => {
                if (prevTime >= 45) {
                    clearInterval(timerInterval);
                    setResultMessage('Match request timed out. Please try again.');
                    setMatchStatus('timeout');
                    return prevTime;
                }
                else if (prevTime >= 30) {
                    setResultMessage('We are trying our best to find a match for you...');
                }
                else if (prevTime >= 15) {
                    setResultMessage('Hang on! We are still looking for a match...');
                }
                return prevTime + 1;
            });
        }, 1000);
        timerIntervalRef.current = timerInterval;
    };

    // TODO: navigate to collaboration page
    const startCountdown = (count: number) => {
        setCountdown(count);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    // navigate('/collaboration');
                    return 0; 
                }
                return prev ? prev - 1 : 0; 
            });
        }, 1000);
    };

    const resetMatch = () => {
        setMatchStatus(null);
        setTimer(0);
        setResultMessage('');
        setCountdown(null);
    };

    return (
        <>
            <Paper elevation={4} sx={{ padding: "20px", maxWidth: "600px", borderRadius: "10px", margin: "auto" }}>
                <Typography variant="h5" mb="20px" color="#9AC143">
                    Matching
                </Typography>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Autocomplete
                        options={availableCategories}
                        value={category}
                        onChange={(event, newValue) => setCategory(newValue)}
                        renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Select Difficulty</InputLabel>
                        <Select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            label="Select Difficulty"
                        >
                            <MenuItem value="EASY">Easy</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HARD">Hard</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSendRequest}
                            startIcon={<PersonSearchIcon />}
                            sx={{ color: "white" }}
                        >
                            Match
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* View Modal */}
            <Modal open={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {matchStatus === 'searching' && <CircularProgress size="3rem" color="secondary" />}
                        {matchStatus === 'success' && <MoodIcon sx={{ color: 'success.main', fontSize: 60 }} />}
                        {matchStatus === 'timeout' && <MoodBadIcon sx={{ color: 'error.main', fontSize: 60 }} />}
                        <Typography
                            mt={3}
                            variant="body1"
                            color={resultMessage.includes("Successfully matched") ? "success.main" : resultMessage.includes("timed out") ? "error.main" : "white"}
                            textAlign="center"
                        >
                            {resultMessage}
                        </Typography>

                        {matchStatus === 'searching' && <Typography mt={2} variant="body2" textAlign="center">
                             Time in queue: {timer}s
                        </Typography>}

                        {countdown !== null && (
                            <Typography mt={2} variant="body2" textAlign="center">
                                {countdown > 0 ? `You will be redirected in ${countdown}...` : null}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleClose}
                                sx={{ color: "white" }}
                            >Cancel
                            </Button>
                            {matchStatus === 'timeout' && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        resetMatch();
                                        handleSendRequest();
                                    }}
                                >
                                    Retry
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Snackbar open={snackbarCategoryOpen} autoHideDuration={6000} onClose={handleSnackbarCategoryClose}>
                <Alert
                    onClose={handleSnackbarCategoryClose}
                    severity="error"
                    variant="filled"
                >
                    Please select a category
                </Alert>
            </Snackbar>

            <Snackbar open={snackbarDifficultyOpen} autoHideDuration={6000} onClose={handleSnackbarDifficultyClose}>
                <Alert
                    onClose={handleSnackbarDifficultyClose}
                    severity="error"
                    variant="filled"
                >
                    Please select a difficulty
                </Alert>
            </Snackbar>
        </>
    );
}

export default MatchingComponent;
