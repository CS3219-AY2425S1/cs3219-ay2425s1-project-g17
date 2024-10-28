import React, { useState, useRef } from 'react';
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
import PublishIcon from '@mui/icons-material/Publish';
import * as Y from "yjs"
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';
import socket from "../../context/socket"
import { cacheCode, getCacheCode, disconnectUser } from '../../services/collaboration-service/CollaborationService';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';

interface CodeEditorProps {
    sessionId: string;
    onConfirmSubmission: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    sessionId,
    onConfirmSubmission
}) => {
    const [language, setLanguage] = useState<string>('javascript');
    const [code, setCode] = useState<string>('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);

    const navigate = useNavigate();

    const doc = new Y.Doc();

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount = async (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
        editorRef.current = editor;

        const provider = new WebrtcProvider(sessionId, doc, {
            signaling: ["ws://localhost:4003"]
        });
        const type = doc.getText("monaco");
        const binding = new MonacoBinding(
            type, 
            editorRef.current.getModel() as monaco.editor.ITextModel, 
            new Set([editorRef.current]), 
            provider.awareness
        );

        const defaultLanguage = "noLanguage";
        const cachedCodeData = await getCacheCode(sessionId, defaultLanguage);
        const cachedCode = cachedCodeData.code;
        const currLanguage = cachedCodeData.currLanguage;

        if (cachedCode != "") {
            setCode(cachedCode);
        }

        if (currLanguage != "") {
            setLanguage(currLanguage);
        }

        editor.onDidChangeModelContent(async () => {
            setCode(editor.getValue());
        });
    }

    const handleCloseSubmitPopup = () => {
        setIsSubmitPopupOpen(false);
    };


    const handleSubmitCode = () => {
        setIsSubmitPopupOpen(true);
    }

    const handleSubmitCodePopup = () => {
        onConfirmSubmission();
    }

    
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

    const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
        const newLanguage = event.target.value as string;
        socket.emit("changeLanguage", {sessionId, newLanguage});
        await cacheCode(sessionId, code, language, newLanguage);
        const cachedCodeData = await getCacheCode(sessionId, newLanguage);
        const cachedCode = cachedCodeData.code;
        setLanguage(newLanguage);
        if (cachedCode != null) {
            setCode(cachedCode);
        } else {
            setCode('');
        }
    };

    React.useEffect(() => {
        // Add event listeners for refreshing or navigating away
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            await cacheCode(sessionId, code, language, language);

        };

        const handlePopState = async () => {
            await cacheCode(sessionId, code, language, language);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    });

    React.useEffect(() => {
        socket.on("changeLanguage", async (language) => {
            setLanguage(language);
        });
      }, [socket]);

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
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmitCode}
                            sx={{ marginRight: '8px', textTransform: 'none', color: 'white' }}
                            startIcon={<PublishIcon />}
                        >
                            Submit
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
                    onMount={handleEditorDidMount}
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
            <Popup
                isOpen={isSubmitPopupOpen}
                onConfirmDisconnect={handleSubmitCodePopup}
                onCloseDisconnect ={handleCloseSubmitPopup}
                title="Submit"
                description="Are you sure you want to submit? Once submitted, you won’t be able to make further changes."
                option={["Cancel", "Confirm"]}
            />
        </>
    );
};

export default CodeEditor;
