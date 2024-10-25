import React from 'react';
import { 
    Button,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from '@mui/material';

interface PopupProps {
    isOpen: boolean;
    title: string,
    description: string
    onConfirmDisconnect: () => void;
    onCloseDisconnect: () => void;
}

const DisconnectPopup: React.FC<PopupProps> = ({ 
    isOpen,
    title,
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
                {`${title}?`}
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
                    {title}
                </Button>
            </DialogActions>
        </Dialog>
    );

}


export default DisconnectPopup;
