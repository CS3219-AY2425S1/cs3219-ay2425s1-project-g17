import React from 'react';
import { 
    Button,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from '@mui/material';

interface DisconnectProps {
    isOpen: boolean;
    description: string
    onConfirmDisconnect: () => void;
    onCloseDisconnect: () => void;
}

const DisconnectPopup: React.FC<DisconnectProps> = ({ 
    isOpen,
    description,
    onConfirmDisconnect, 
    onCloseDisconnect
 }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onCloseDisconnect}
            fullWidth={false}  
            maxWidth="xs" 
            PaperProps={{
                sx: {
                    padding: 2,
                    borderRadius: '12px',
                },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                Disconnect?
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    sx={{ textAlign: 'center' }}
                >
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                    onClick={onCloseDisconnect}
                    color="secondary"
                    variant="outlined"
                    sx={{ borderRadius: 5 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirmDisconnect}
                    color="primary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                >
                    Disconnect
                </Button>
            </DialogActions>
        </Dialog>
    );

}


export default DisconnectPopup;
