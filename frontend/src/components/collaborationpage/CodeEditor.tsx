import React, { useState, useEffect } from 'react';
import { Editor } from "@monaco-editor/react";
import { 
    Tabs,
    Tab, 
    Box, 
    Button, 
    Snackbar, 
    Alert, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle 
} from '@mui/material';

import io from "socket.io-client";


const CodeEditor = () => {
    const socket = io("http://localhost:4003");

    //TODO: Update Room ID
    const room = "TESTROOMID123"
    socket.emit("join_room", room);
    const [language, setLanguage] = useState('javascript'); 
    const [code, setCode] = useState(`var message = 'Hello, World!';\nconsole.log(message);`); 
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const handleSave = () => {
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

    const handleLanguageChange = (event: React.SyntheticEvent, newValue: string) => {
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

    const sendMessage = (message: string) => {
        socket.emit("send_message", { message, room });
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value); 
            sendMessage(value)
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
          console.log(data.message);
          setCode(data.message);
        });
      }, [socket]);

    return (
        <Box height="90%" display="flex" flexDirection="column">
            <Tabs
                value={language}
                onChange={handleLanguageChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
            <Tab label="JavaScript" value="javascript" />
            <Tab label="C++" value="cpp" />
            <Tab label="Python" value="python" />
            <Tab label="Java" value="java" />
        </Tabs>

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
            onChange={handleEditorChange}
        />

        <Box display="flex" justifyContent="space-between" padding={2} gap={10}>
            <Button variant="outlined" color="secondary" sx={{ borderRadius: 2 }}>
                Show Console
            </Button>
            <Box>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleSave} 
                    sx={{ marginRight: '8px', borderRadius: 2 }} 
                >
                    Save
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit} 
                    sx={{ borderRadius: 2 }}
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
                Your code has been saved!
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
                    color="secondary"
                    variant="outlined"
                    sx={{ borderRadius: 5 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmSubmit}
                    color="primary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
      </Box>
    );
};

export default CodeEditor;
