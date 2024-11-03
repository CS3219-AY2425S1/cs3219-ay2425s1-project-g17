import React, { useState, useRef } from 'react';
// eslint-disable-next-line import/no-unresolved
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
    SelectChangeEvent,
    CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Terminal, Clear } from '@mui/icons-material'
import PublishIcon from '@mui/icons-material/Publish';
import * as Y from "yjs"
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';
import socket from "../../context/socket"
import { cacheCode, getCacheCode } from '../../services/collaboration-service/CollaborationService';
import Popup from './Popup';
import { executeCode } from '../../services/codeexecution-service/CodeExecutionService';

interface CodeEditorProps {
    sessionId: string;
    template: string;
    onConfirmSubmission: () => void;
    onCodeChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    sessionId,
    template,
    onConfirmSubmission,
    onCodeChange
}) => {
    const [language, setLanguage] = useState<string>('javascript');
    const [code, setCode] = useState<string>('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
    const [isSubmitPopupOpen, setIsSubmitPopupOpen] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [consoleError, setConsoleError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Boilerplate code for different languages
    const boilerplateCode: { [key: string]: string } = {
        javascript: `function solution() {\n\t// your code here\n}\n\nfunction main() {\n\tsolution();\n}\n\nmain();`,
        python: `def solution():\n\t# your code here\n\n\ndef main():\n\tsolution()\n\n\nif __name__ == "__main__":\n\tmain()`,
        java: `class Main {\n\tpublic static void solution() {\n\t\t// your code here\n\t}\n\n\tpublic static void main(String[] args) {\n\t\tsolution();\n\t}\n}`,
        cpp: `#include <iostream>\nusing namespace std;\n\nvoid solution() {\n\t// your code here\n}\n\nint main() {\n\tsolution();\n\treturn 0;\n}`
    };

    const doc = new Y.Doc();

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorDidMount = async (editor: monaco.editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
        editorRef.current = editor;

        // WebRTC & Yjs setup
        const provider = new WebrtcProvider(sessionId, doc, {
            signaling: [process.env.REACT_APP_COLLABORATION_WEBSOCKET_URI ?? "ws://localhost:4003"]
        });
        const type = doc.getText("monaco");
        const decodedTemplate = base64ToUint8Array(template);
        Y.applyUpdate(doc, decodedTemplate);

        new MonacoBinding(
            type,
            editor.getModel() as monaco.editor.ITextModel,
            new Set([editor]),
            provider.awareness
        );

        const cachedCodeData = await getCacheCode(sessionId, language);
        const cachedCode = cachedCodeData.code;
        const currLanguage = cachedCodeData.currLanguage || 'javascript';

        // Set the language based on cache, if available
        setLanguage(currLanguage);

        // Only set initial code if editor is empty (for first load)
        if (!editor.getValue()) {
            const initialCode = cachedCode || boilerplateCode[currLanguage];
            editor.setValue(initialCode);
        }

        editor.onDidChangeModelContent(() => {
            setCode(editor.getValue());
            onCodeChange(editor.getValue());
        });
    }


    const base64ToUint8Array = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    const handleSubmitCode = () => {
        setIsSubmitPopupOpen(true);
    }


    const handleCloseSubmitPopup = () => {
        setIsSubmitPopupOpen(false);
    }


    const handleRunCode = async () => {
        setConsoleOutput('');
        setConsoleError('');

        setIsLoading(true);
        const { output, error } = await executeCode(code, language);
        setIsLoading(false);

        if (output) {
            setConsoleOutput(output);
        }
        if (error) {
            setConsoleError(error);
        }
        setIsSnackbarOpen(true);
    };


    const handleClearConsole = () => {
        setConsoleOutput('');
        setConsoleError('');
    };

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
        const newLanguage = event.target.value as string;
        socket.emit("changeLanguage", { sessionId, newLanguage });
    
        const cachedCodeData = await getCacheCode(sessionId, newLanguage);
        const cachedCode = cachedCodeData.code;
    
        setLanguage(newLanguage);
    
        if (cachedCode) {
            // Load cached code if available
            setCode(cachedCode);
            editorRef.current?.setValue(cachedCode);
        } else {
            // Otherwise, load the boilerplate for the new language
            const boilerplate = boilerplateCode[newLanguage] || '';
            setCode(boilerplate);
            editorRef.current?.setValue(boilerplate);
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
    }, []);


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
                            color="primary"
                            onClick={handleRunCode}
                            sx={{ textTransform: 'none', color: 'black' }}
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
                        borderColor: 'grey.800'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isLoading ? <CircularProgress size="24px" sx={{ mr: 1 }} /> : <Terminal sx={{ mr: 1 }} />}
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
                    flexGrow: 1,
                    overflowY: "auto"
                }}>
                    <Paper sx={{
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                        overflowY: "auto",
                        width: "100%",
                        maxHeight: "100%",
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
                onConfirmDisconnect={onConfirmSubmission}
                onCloseDisconnect={handleCloseSubmitPopup}
                title="Submit code?"
                description="Once submitted, no further changes can be made, and the session will close for both participants."
                option={["Cancel", "Submit"]}
                button_color='secondary'
            />
        </>
    );
};

export default CodeEditor;
