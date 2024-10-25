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
import Popup from './Popup';

interface CodeEditorProps {
    onConfirmSubmission: () => void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ 
    onConfirmSubmission
 }) => {

    const [language, setLanguage] = useState('javascript'); 
    const [code, setCode] = useState(`var message = 'Hello, World!';\nconsole.log(message);`); 
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false); 
    const [isSubmissionPopupOpen, setIsSubmissionPopupOpen] = useState(false);

    const onSave = () => {
        setIsSnackbarOpen(true); 
    };

    const onSubmit = () => {
        setIsSubmissionPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsSubmissionPopupOpen(false); 
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

    // const sendMessage = (message: string) => {
    //     socket.emit("send_message", { message, room });
    // };

    // const handleEditorChange = (value: string | undefined) => {
    //     if (value !== undefined) {
    //         setCode(value); 
    //         sendMessage(value)
    //     }
    // }

    // useEffect(() => {
    //     socket.on("receive_message", (data) => {
    //       console.log(data.message);
    //       setCode(data.message);
    //     });
    //   }, [socket]);

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
            //onChange={handleEditorChange}
        />

        <Box display="flex" justifyContent="space-between" padding={2} gap={10}>
            <Button variant="outlined" color="secondary" sx={{ borderRadius: 2 }}>
                Show Console
            </Button>
            <Box>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={onSave} 
                    sx={{ marginRight: '8px', borderRadius: 2 }} 
                >
                    Save
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={onSubmit} 
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
        <Popup
            isOpen={isSubmissionPopupOpen}
            onConfirmDisconnect={onConfirmSubmission}
            onCloseDisconnect ={handleClosePopup}
            title="Submit"
            description="Are you sure you want to submit? Once submitted, you won’t be able to make further changes."
            />
      </Box>
    );
};

export default CodeEditor;
