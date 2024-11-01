import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
    Paper,
    Box,
    TextField,
    Typography,
    Avatar,
} from '@mui/material';
import { getSessionMessages } from "../../services/chat-service/ChatService"
import ChatIcon from '@mui/icons-material/Chat';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

const socket = io(process.env.REACT_APP_CHAT_SOCKET_URI ?? "http://localhost:4005");  // Update URL if different

interface ChatProps {
    sessionId: string;
    partnerProfPicUrl: string;
    ownProfPicUrl: string;
}

interface MessageProps {
    sender: 'self' | 'other';
    content: string;
}

const MessageBubble: React.FC<MessageProps & { avatarUrl: string }> = ({ sender, content, avatarUrl }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: sender === 'self' ? 'flex-end' : 'flex-start',
            p: 1,
            alignItems: 'center',
        }}
    >
        {sender === 'other' && (
            <Avatar src={avatarUrl} alt="profile" sx={{ mr: 1 }} />
        )}
        <Box
            sx={{
                maxWidth: '70%',
                bgcolor: sender === 'self' ? 'secondary.main' : 'grey.300',
                color: sender === 'self' ? 'white' : 'black',
                borderRadius: 2,
                p: 1,
                position: 'relative',
                ...(sender === 'self'
                    ? { borderBottomRightRadius: 0 }
                    : { borderBottomLeftRadius: 0 }),
            }}
        >
            <Typography variant="body2" sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                {content}
            </Typography>
        </Box>
        {sender === 'self' && (
            <Avatar src={avatarUrl} alt="profile" sx={{ ml: 1 }} />
        )}
    </Box>
);

const ChatComponent: React.FC<ChatProps> = ({ sessionId, ownProfPicUrl, partnerProfPicUrl }) => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<MessageProps[]>([]);
    const username = localStorage.getItem('username') || '';
    const userId = localStorage.getItem('id') || '';
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on('receiveMessage', ({ message }) => {
            setChatLog((prevLog) => [...prevLog, { sender: 'other', content: `${message}` }]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatLog]);

    const joinSession = async () => {
        socket.emit('joinSession', { userId: userId, sessionId });
    };

    const sendMessage = () => {
        if (sessionId && message) {
            socket.emit('sendMessage', { sessionId, message, userId, username });
            setChatLog((prevLog) => [...prevLog, { sender: 'self', content: `${message}` }]);
            setMessage('');
        }
    };

    useEffect(() => {
        async function fetchSessionMessages() {
            try {
                if (sessionId != '') {
                    const messages = await getSessionMessages(sessionId);
                    const chatLog: MessageProps[] = [];
                    for (const value of Object.values(messages)) {
                        const { senderId, message } = JSON.parse(value as string);
                        if (senderId == userId) {
                            chatLog.push({ sender: 'self', content: `${message}` });
                        } else {
                            chatLog.push({ sender: 'other', content: `${message}` });
                        }
                    }
                    setChatLog(chatLog);
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }
        joinSession();
        if (chatLog.length === 0) {
            fetchSessionMessages();
        }
    }, [chatLog.length, sessionId, userId]);

    return (
        <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
                    <ChatIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle2"><b>Chat</b></Typography>
                </Box>
            </Box>

            <Box sx={{ overflowY: 'auto', p: 1, flex: 1 }}>
                {chatLog.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}>
                        <Typography color="textSecondary" textAlign="center">
                            No messages yet. Start the conversation!
                        </Typography>
                    </Box>
                ) : (
                    chatLog.map((msg, idx) => (
                        <MessageBubble
                            key={idx}
                            sender={msg.sender}
                            content={msg.content}
                            avatarUrl={msg.sender === 'self' ? ownProfPicUrl : partnerProfPicUrl}
                        />
                    ))
                )}
                <div ref={chatEndRef} />
            </Box>

            <Box sx={{ display: 'flex', p: 1 }}>
                <TextField
                    placeholder="Message"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    autoComplete="off"
                />
                <IconButton
                    onClick={sendMessage}
                    sx={{ color: "white" }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default ChatComponent;
