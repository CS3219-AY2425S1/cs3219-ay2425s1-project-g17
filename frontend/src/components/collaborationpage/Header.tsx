import React, { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DisconnectIcon from '@mui/icons-material/PowerSettingsNew';
import Avatar from '@mui/material/Avatar';
import Popup from './Popup';
import Tooltip from '@mui/material/Tooltip';

interface HeaderProps {
    partnerName: string;
    partnerProfPicUrl: string;
    ownProfPicUrl: string;
    onShuffleQuestion: () => void;
    onConfirmDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({
    partnerName,
    partnerProfPicUrl,
    ownProfPicUrl,
    onShuffleQuestion,
    onConfirmDisconnect
}) => {
    const [isDisconnectPopupOpen, setIsDisconnectPopupOpen] = useState(false);

    const onDisconnect = () => {
        setIsDisconnectPopupOpen(true);
    };

    const handleCloseDisconnectPopup = () => {
        setIsDisconnectPopupOpen(false);
    };

    const handleConfirmDisconnect = async () => {
        onConfirmDisconnect();
    };
    
    const onShuffleQuestions = async () => {
        onShuffleQuestion();
    };

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

            <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Me">
                    <Avatar src={ownProfPicUrl} sx={{ bgcolor: "white" }}/>
                </Tooltip>
                <Tooltip title={partnerName}>
                <Avatar src={partnerProfPicUrl} sx={{ bgcolor: "white" }} />
                </Tooltip>
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

            <Popup
                isOpen={isDisconnectPopupOpen}
                onConfirmDisconnect={handleConfirmDisconnect}
                onCloseDisconnect={handleCloseDisconnectPopup}
                title="Disconnect room?"
                description="You won't be able to rejoin this session."
                option={["Cancel", "Disconnect"]}
            />
        </Box>
    );
};

export default Header;
