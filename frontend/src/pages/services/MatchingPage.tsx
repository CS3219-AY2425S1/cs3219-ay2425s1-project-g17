import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Button, TextField, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';

const api = axios.create({
    baseURL: "http://localhost:4002",
    timeout: 5000, // Timeout after 5 seconds
});

// Centralized error handling for Axios
function handleAxiosError(error: any) {
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        return error.response?.data?.message || 'An error occurred while processing your request';
    } else {
        console.error("Unexpected error:", error);
        return 'An unexpected error occurred';
    }
}

const MatchingService = () => {
    const [userId, setUserId] = useState('');
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [timer, setTimer] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Store the timer interval

    const handleSendRequest = async () => {
        if (!userId) {
            setResultMessage('Please enter a valid User ID.');
            return;
        }

        setResultMessage('Sending match request...');
        try {
            const response = await api.post('/matching/match-request', {
                userId,
                category,
                difficulty,
            });

            setResultMessage('Waiting for match...');
            pollForMatch(userId);
            startTimer();
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            setResultMessage(errorMessage);
        }
    };

    const pollForMatch = (userId: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await api.get(`/matching/check-match-status/${userId}`);
                if (response.data.matched) {
                    setResultMessage(`Successfully matched with ${response.data.partnerId}, you will be attempting a ${response.data.difficultyAssigned} question on ${response.data.categoryAssigned}`);
                    clearInterval(pollInterval); // Stop polling when match is found
                    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Stop the timer from here
                } else {
                    setResultMessage('Still searching for a match...');
                }
            } catch (error) {
                const errorMessage = handleAxiosError(error);
                setResultMessage(errorMessage);
                clearInterval(pollInterval); // Stop polling on error
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Stop the timer on error
            }
        }, 2000); // Poll every 2 seconds

        setIntervalId(pollInterval); // Store poll interval ID for clearing later
    };
    

    const startTimer = () => {
        setTimer(0);
        const timerInterval = setInterval(() => {
            setTimer((prevTime) => {
                if (prevTime >= 45) {
                    clearInterval(timerInterval); // Stop the timer at 45 seconds
                    setResultMessage('Match request timed out. Please try again.');
                    if (intervalId) clearInterval(intervalId); // Stop polling as well
                    return prevTime;
                }
                return prevTime + 1;
            });
        }, 1000); // Increase the timer every second

        timerIntervalRef.current = timerInterval; // Store the timer interval in ref
    };


    return (
        <Container>
            <Typography variant="h4" gutterBottom>Matching Service</Typography>

            {/* Input for User ID */}
            <Box mb={2}>
                <TextField
                    fullWidth
                    label="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </Box>

            {/* Input for Category */}
            <Box mb={2}>
                <FormControl fullWidth>
                    <InputLabel>Select Category</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <MenuItem value="Algorithms">Algorithms</MenuItem>
                        <MenuItem value="Bit Manipulation">Bit Manipulation</MenuItem>
                        <MenuItem value="Data Structures">Data Structures</MenuItem>
                        <MenuItem value="Databases">Databases</MenuItem>
                        <MenuItem value="Recursion">Recursion</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Input for Difficulty */}
            <Box mb={2}>
                <FormControl fullWidth>
                    <InputLabel>Select Difficulty</InputLabel>
                    <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <MenuItem value="EASY">Easy</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HARD">Hard</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Button to send match request */}
            <Button variant="contained" color="primary" onClick={handleSendRequest}>
                Send Match Request
            </Button>

            {/* Result message */}
            <Typography mt={2} variant="body1">{resultMessage}</Typography>

            {/* Timer */}
            <Typography mt={2} variant="body2">Time in queue: {timer}s</Typography>
        </Container>
    );
}

export default MatchingService;
