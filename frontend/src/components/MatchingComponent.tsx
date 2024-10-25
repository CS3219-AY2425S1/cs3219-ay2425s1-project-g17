import React, { useState, useEffect, useRef } from 'react';
import {
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
import CodeIcon from '@mui/icons-material/Code';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { sendMatchRequest, pollMatchStatus, cancelMatchRequest } from '../services/matching-service/MatchingService';
import { getAvailableCategories } from '../services/question-service/QuestionService';
import { useNavigate } from 'react-router-dom';
import { getSessionInfo } from '../services/collaboration-service/CollaborationService';

const MatchingComponent = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<string | null>('');
    const [difficulty, setDifficulty] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [timer, setTimer] = useState(0);
    const [matchStatus, setMatchStatus] = useState<'searching' | 'success' | 'timeout' | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [open, setOpen] = React.useState(false);
    const [snackbarCategoryOpen, setSnackbarCategoryOpen] = React.useState(false);
    const [snackbarDifficultyOpen, setSnackbarDifficultyOpen] = React.useState(false);
    const [isSession, setIsSession] = useState(false);

    const userId = localStorage.getItem('id') || '';

    // Get available categories
    useEffect(() => {
        getAvailableCategories()
            .then((categories) => setAvailableCategories(categories))
            .catch((error) => console.error("Error:", error));

        // Add event listeners for refreshing or navigating away
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            handleCancelRequest();

        };

        const handlePopState = () => {
            handleCancelRequest();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    });

    // Check if collaboration session exists
    useEffect(() => {
        async function fetchSessionInfo() {
            try {
                const data = await getSessionInfo(userId);
                if (data) {
                    setIsSession(true);
                }
            } catch (error) {
                setIsSession(false);
                console.error('Failed to fetch session:', error);
            }
        }
        fetchSessionInfo();
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

    const handleCancelRequest = async () => {
        const userId = localStorage.getItem('id');
        const username = localStorage.getItem('username');
        try {
            await cancelMatchRequest(userId, username);
        } catch (error: any) {
            alert("Error Cancelling: " + error.message);
        }
        handleClose();
    };

    const handleSendRequest = async () => {
        const userId = localStorage.getItem('id');
        const username = localStorage.getItem('username');
        if (!userId) {
            alert('User not authenticated');
            return;
        }
        if (!username) {
            console.error('Username not found');
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
        handleOpen();
        try {
            await sendMatchRequest(userId, username, category, difficulty);
            setResultMessage('Sit tight while we find a match for you...');
            setMatchStatus('searching');
            pollForMatch(userId);
            startTimer();
        } catch (error: any) {
            setResultMessage(error.message);
        }
    };

    const pollForMatch = (userId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const matchData = await pollMatchStatus(userId);
                if (matchData.matched) {
                    console.log(matchData)
                    setResultMessage(`Successfully matched with ${matchData.partnerUsername}, you will be attempting a ${matchData.difficultyAssigned} question on ${matchData.categoryAssigned}`);
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

    const startCountdown = (count: number) => {
        setCountdown(count);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setTimeout(() => {
                        navigate('/collaboration');
                    }, 0);
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

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerTop = container.getBoundingClientRect().top;

            if (containerTop <= 10) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleRejoinSession = () => {
        navigate('/collaboration');
    }

    // If there is no session, render the matching component
    if (!isSession) {
        return (
            <>
                <div ref={containerRef}>
                    {isFixed && (
                        <Box
                            sx={{
                                width: "25vw",
                                display: 'flex',
                                position: 'relative',
                            }}
                        >

                        </Box>)}
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            height: "35vh",
                            width: "25vw",
                            display: 'flex',
                            flexDirection: 'column',
                            position: isFixed ? 'fixed' : 'relative',
                            top: isFixed ? '10px' : 'auto',
                            zIndex: 2,
                        }}
                    >
                        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'white', fontSize: '18px' }}>
                            Find a Match
                        </Typography>

                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Autocomplete
                                size='small'
                                options={availableCategories}
                                value={category}
                                onChange={(event, newValue) => setCategory(newValue)}
                                renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                            />
                            <FormControl size='small' variant="outlined" fullWidth>
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
                    </Box>

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
                                    {matchStatus !== 'success' && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleCancelRequest}
                                            sx={{ color: "white" }}
                                        >Cancel
                                        </Button>
                                    )}
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
                </div>
            </>
        );
    }

    // If there is a session, render the rejoin session button
    return (
        <>
            <div ref={containerRef}>
                {isFixed && (
                    <Box
                        sx={{
                            width: "25vw",
                            display: 'flex',
                            position: 'relative',
                        }}
                    >

                    </Box>)}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 2,
                        height: "35vh",
                        width: "25vw",
                        display: 'flex',
                        flexDirection: 'column',
                        position: isFixed ? 'fixed' : 'relative',
                        top: isFixed ? '10px' : 'auto',
                        zIndex: 2,
                        background: 'linear-gradient(to right, #141e30, #243b55)'

                    }}
                >
                    <Box display="flex" justifyContent="center" mb={2}>
                        <CodeIcon color="primary" sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h5" component="h2" align="center" fontWeight="bold" color="primary">
                        Active Coding Session
                    </Typography>
                    <Typography variant="body1" align="center">
                        You have an ongoing coding session. Would you like to rejoin?
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<ExitToAppIcon />}
                            onClick={handleRejoinSession}
                            sx={{ color: "white" }}
                            size="large"
                        >
                            Rejoin Session
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    );
}

export default MatchingComponent;
