import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
    Paper,
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
} from '@mui/material';

const socket = io("http://localhost:4005");  // Update URL if different

interface ChatProps {
    sessionId: string;
}

const ChatComponent: React.FC<ChatProps> = ({
    sessionId
}) => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        socket.on('receiveMessage', ({ message, username }) => {
            console.log("H");
            console.log(sessionId);
            setChatLog((prevLog) => [...prevLog, `${username}: ${message}`]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const joinSession = async () => {
        socket.emit('joinSession', { userId: username, sessionId });
    };

    const sendMessage = () => {
        if (sessionId && message) {
            socket.emit('sendMessage', { sessionId, message, username });
            setChatLog((prevLog) => [...prevLog, `You: ${message}`]);
            setMessage('');
        }
    };

    useEffect(() => {
        joinSession();
      }, []);
    return (
        <Paper elevation={4} sx={{ padding: "20px", borderRadius: "10px", margin: "auto" }}>
            <Typography variant="h5" mb="20px" color="#9AC143">
                Chat Room
            </Typography>
            
            <Box sx={{ mt: 3, mb: 2, maxHeight: "130px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                {chatLog.length === 0 ? (
                    <Typography color="textSecondary" textAlign="center">
                        No messages yet. Start the conversation!
                    </Typography>
                ) : (
                    chatLog.map((msg, idx) => (
                        <Typography key={idx} variant="body2"
                        sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                        >
                            {msg}
                        </Typography>
                    ))
                )}
            </Box>
            <Box component="form" sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Message"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={sendMessage}
                    sx={{ color: "white" }}
                >
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default ChatComponent;
