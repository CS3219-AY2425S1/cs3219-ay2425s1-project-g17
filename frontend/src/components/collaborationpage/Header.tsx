import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DisconnectIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    // TODO: Implement disconnect functionality
    const onDisconnect = () => {
        // Disconnect the user from the partner
        navigate('/dashboard');
        return;
    };

    // TODO: Implement shuffle functionality
    const onShuffleQuestions = () => {
        // Logic to shuffle questions goes here
        console.log("Shuffling questions...");
    };

    // TODO: Replace with actual partner name
    const partnerName = 'John Doe';

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="8px"
            ml={1}
            mr={1}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onShuffleQuestions}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    startIcon={<ShuffleIcon />}
                >
                    Shuffle Question
                </Button>
            </Box>

            <Typography color="textPrimary">
                You are connected with <strong>{partnerName}</strong>
            </Typography>

            <Button
                variant="outlined"
                color="error"
                onClick={onDisconnect}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                startIcon={<DisconnectIcon />}
            >
                Disconnect
            </Button>
        </Box>
    );
};

export default Header;
