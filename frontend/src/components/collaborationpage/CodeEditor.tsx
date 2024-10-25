import React, { useState, useEffect } from 'react';
import { Editor } from "@monaco-editor/react";
import {
    Box,
    Button,
    Snackbar,
    Alert,
    Typography,
    Paper,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Terminal, Clear } from '@mui/icons-material'

interface CodeEditorProps {
    onConfirmSubmission: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    onConfirmSubmission
}) => {
    const [language, setLanguage] = useState<string>('javascript');
    const [code, setCode] = useState<string>(`var message = 'Hello, World!';\nconsole.log(message);`);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const handleRunCode = () => {
        setConsoleOutput('');
        setConsoleError('');

        if (language === 'javascript') {
            try {
                // Temporarily override console.log to capture its output
                const logOutput: string[] = [];
                const originalConsoleLog = console.log;

                console.log = (msg: any) => {
                    if (typeof msg === 'object') {
                        logOutput.push(JSON.stringify(msg));
                    } else {
                        logOutput.push(msg.toString());
                    }
                };

                // Evaluate the code
                eval(code);

                // Restore original console.log after execution
                console.log = originalConsoleLog;

                // Set the captured log output
                setConsoleOutput(logOutput.join('\n') || "Code executed successfully");

            } catch (err: any) {
                setConsoleError(`${err}`);
            }
        } else {
            setConsoleError('Code execution is only supported for JavaScript.');
        }

        setIsSnackbarOpen(true);
    };

    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [consoleError, setConsoleError] = useState<string>('');

    const handleClearConsole = () => {
        setConsoleOutput('');
        setConsoleError('');
    };

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

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
        <>
            <Paper sx={{ height: "64vh", display: "flex", flexDirection: "column" }}>
                <Box display="flex" justifyContent="space-between" padding={1} alignItems="center">
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <Select
                            labelId="language-select-label"
                            value={language}
                            sx={{ fontSize: '14px' }}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value="javascript">JavaScript</MenuItem>
                            <MenuItem value="cpp">C++</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                            <MenuItem value="java">Java</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Run and Submit Buttons */}
                    <Box display="flex" justifyContent="right" padding={1} gap={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleRunCode}
                            sx={{ marginRight: '8px', textTransform: 'none', color: 'white' }}
                            startIcon={<PlayArrowIcon />}
                        >
                            Run
                        </Button>
                    </Box>
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
                //onChange={handleEditorChange}
                />
            </Paper>


            {/* Console Output Section */}
            <Paper sx={{ height: "23.75vh", display: "flex", flexDirection: "column", mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderBottom: '1px solid',
                        borderColor: 'grey.800',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Terminal sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Console</Typography>
                    </Box>
                    <Button
                        size="small"
                        startIcon={<Clear />}
                        onClick={handleClearConsole}
                        sx={{ color: 'grey.300' }}
                    >
                        Clear
                    </Button>
                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1
                }}>
                    <Paper sx={{
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                        overflowY: "auto",
                        width: "100%",
                        height: "100%",
                        padding: 2,
                    }}>
                        {consoleOutput && (
                            <Typography sx={{ color: 'white', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>
                                {consoleOutput}
                            </Typography>
                        )}
                        {consoleError && (
                            <Typography sx={{ color: '#FF4500', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'pre-wrap' }}>
                                {consoleError}
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </Paper>

            {/* Snackbar and Popup Dialog */}
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Your code has been run!
                </Alert>
            </Snackbar>
        </>
    );
};

export default CodeEditor;
