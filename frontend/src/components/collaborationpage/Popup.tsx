import React from 'react';
import {
    Button,
    Typography,
    Box,
    Modal
} from '@mui/material';

interface PopupProps {
    isOpen: boolean;
    title: string,
    description: string
    onConfirmDisconnect: () => void;
    onCloseDisconnect: () => void;
    option: (string | null)[];
}

const DisconnectPopup: React.FC<PopupProps> = ({
    isOpen,
    title,
    description,
    onConfirmDisconnect,
    onCloseDisconnect,
    option
}) => {
    return (
        <Modal open={isOpen}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Typography sx={{ mb: 4 }}>
                    {description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'right', gap: 2 }}>
                    {!!option[0] && (<Button variant="outlined" onClick={onCloseDisconnect}>
                        {option[0]}
                    </Button>)}
                    {!!option[1] && (<Button variant="contained" onClick={onConfirmDisconnect} color="error">
                        {option[1]}
                    </Button>)}
                </Box>
            </Box>
        </Modal>
    );

}


export default DisconnectPopup;