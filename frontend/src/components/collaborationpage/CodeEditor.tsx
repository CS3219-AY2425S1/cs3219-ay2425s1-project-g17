import React, { useState } from 'react';
import { Editor } from "@monaco-editor/react";
import {
    Box,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
    IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import RestoreIcon from '@mui/icons-material/Restore';

const CodeEditor = () => {
    const [language, setLanguage] = useState<string>('javascript');
    const [code, setCode] = useState<string>(`var message = 'Hello, World!';\nconsole.log(message);`);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const handleRunCode = () => {
        console.log('Running code:', code);
        setIsSnackbarOpen(true);
    };

    const handleSubmit = () => {
        setIsPopupOpen(true);
    };

    const handleConfirmSubmit = () => {
        setIsPopupOpen(false);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    const handleResetCode = () => {
        console.log('Resetting code');
    }

    const handleLanguageChange = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value as string;
        setLanguage(newValue);

        switch (newValue) {
            case 'cpp':
                setCode(`#include <iostream>\n\nint main() {\n   std::cout << "Hello, World!";\n   return 0;\n}`);
                break;
            case 'java':
                setCode(`public class Main {\n   public static void main(String[] args) {\n      System.out.println("Hello, World!");\n   }\n}`);
                break;
            case 'python':
                setCode(`print("Hello, World!")`);
                break;
            case 'javascript':
                setCode(`var message = 'Hello, World!';\nconsole.log(message);`);
                break;
            default:
                setCode('');
        }
    };

    return (
        <Paper sx={{
            height: "90vh",
            display: "flex",
            flexDirection: "column"
        }}>
            <Box display="flex" justifyContent="flex-start" padding={1} alignItems="center">
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                    <Select
                        labelId="language-select-label"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                    </Select>
                </FormControl>
            </Box>


            <Editor
                language={language}
                theme="vs-dark"
                value={code}
                options={{
                    fontSize: 14,
                    formatOnType: true,
                    autoClosingBrackets: "languageDefined",
                    minimap: { enabled: false },
                    padding: { top: 8 },
                }}
                height="80vh"
                onChange={(newCode) => setCode(newCode || '')}
            />

            <Box display="flex" justifyContent="right" padding={1} gap={10}>
                <Box>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleRunCode}
                        sx={{ marginRight: '8px', color: 'white' }}
                        startIcon={<PlayArrowIcon />}
                    >
                        Run Code
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        startIcon={<CodeIcon />}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Your code has been run!
                </Alert>
            </Snackbar>

            <Dialog
                open={isPopupOpen}
                onClose={handleClosePopup}
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
                    Submit Code
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ textAlign: 'center' }}
                    >
                        Dom has clicked on submit. <br />
                        Would you like to confirm the submission and end the session?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleClosePopup}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        color="secondary"
                        variant="contained"
                        sx={{ borderRadius: 5, color: 'white' }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default CodeEditor;
