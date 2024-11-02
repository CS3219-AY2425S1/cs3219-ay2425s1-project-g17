import React, { useState } from 'react';
import Split from 'react-split';
import { createRoot } from 'react-dom/client';
import CodeEditor from '../../components/collaborationpage/CodeEditor';
import QuestionPanel from '../../components/collaborationpage/QuestionPanel';
import ChatComponent from '../../components/collaborationpage/ChatComponent';
import Header from '../../components/collaborationpage/Header';
import { Box, Paper, Typography } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { getSessionInfo, getQuestionInfo, disconnectUser, shuffleQuestion, createHistory } from '../../services/collaboration-service/CollaborationService';
import { getSignedImageURL } from '../../services/user-service/UserService';
import socket from "../../context/socket"
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/collaborationpage/Popup';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteSessionMessages } from "../../services/chat-service/ChatService"

interface ExampleProps {
    id: number;
    input: string;
    output: string;
    explanation: string;
}

interface QuestionProps {
    _id: string;
    question_id: number;
    question_title: string;
    question_description: string;
    question_example: ExampleProps[];
    question_categories: string[];
    question_complexity: string;
    question_popularity: number;
}

const CollaborationPage = () => {
    const [code, setCode] = useState<string>('');
    const [question, setQuestion] = React.useState<QuestionProps | null>(null);
    const [partnerName, setPartnerName] = React.useState('');
    const [partnerProfPicUrl, setPartnerProfPicUrl] = React.useState('');
    const [ownProfPicUrl, setOwnProfPicUrl] = React.useState('');
    const [sessionId, setSessionId] = React.useState('');
    const [template, setTemplate] = React.useState('');
    const [partnerId, setPartnerId] = React.useState('');
    const [questionId, setQuestionId] = React.useState('');
    const [startTime, setStartTime] = React.useState<Date>(new Date());
    const [isDisconnectPopupOpen, setIsDisconnectPopupOpen] = useState(false);
    const [sessionNotFoundOpen, setSessionNotFoundOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userId = localStorage.getItem('id') || '';
    const ownProfPic = localStorage.getItem('profileImage') || '';

    const navigate = useNavigate();

    const handleShuffleQuestion = async () => {
        setIsLoading(true);
        const shuffleRes = await shuffleQuestion(userId);
        socket.emit("shuffleQuestion", sessionId);
        const newQuestionId = shuffleRes.question_id;
        const question = await getQuestionInfo(newQuestionId);
        setQuestion(question);
        setIsLoading(false);
    };

    const handleConfirmDisconnect = async () => {
        socket.emit("disconnectUser", { sessionId, userId });
        try {
            await disconnectUser(sessionId);
            await deleteSessionMessages(sessionId);
            await createHistory(userId, partnerId, questionId, startTime, code);
            await createHistory(partnerId, userId, questionId, startTime, code);
            setTimeout(() => navigate('/dashboard'), 200);
        } catch (error) {
            console.error("Failed to disconnect:", error);
        }
    };

    const handleConfirmSubmit = async () => {
        try {
            socket.emit("disconnectUser", { sessionId, userId });
            await disconnectUser(sessionId);
            await deleteSessionMessages(sessionId);
            await createHistory(userId, partnerId, questionId, startTime, code);
            await createHistory(partnerId, userId, questionId, startTime, code);
            setTimeout(() => navigate('/dashboard'), 200);
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };

    // Function for user that click disconnect when other user disconnects first
    const handleConfirmDisconnectAsWell = () => {
        setTimeout(() => navigate('/dashboard'), 200);
    };

    const handleCloseDisconnect = () => {
        setIsDisconnectPopupOpen(false);
    };

    const handleSessionInactive = () => {
        navigate('/dashboard');
    }

    React.useEffect(() => {
        async function fetchSessionInfo() {
            try {
                const data = await getSessionInfo(userId);
                const questionId = data.session.questionId;

                const question = await getQuestionInfo(questionId);
                setQuestion(question);
                setQuestionId(questionId);
                setPartnerName(data.session.partner);
                setPartnerId(data.session.partnerId);
                setTemplate(data.session.template);

                const startTimeString = data.session.startTime;
                const startTimeDate = new Date(startTimeString);
                setStartTime(startTimeDate);

                const partnerProfPic = data.session.partner_pic;
                const partnerProfPicUrl = await getSignedImageURL(partnerProfPic);
                setPartnerProfPicUrl(partnerProfPicUrl);

                const ownProfPicUrl = await getSignedImageURL(ownProfPic);
                setOwnProfPicUrl(ownProfPicUrl);

                setSessionId(data.sessionId);
                const roomId = data.sessionId
                socket.emit('joinSession', { userId, roomId });
                setSessionNotFoundOpen(false);
            } catch (error) {
                setSessionNotFoundOpen(true);
                console.error('Failed to fetch session:', error);
            }
        }
        fetchSessionInfo();
    }, [ownProfPic, userId]);

    React.useEffect(() => {
        socket.on("shuffle", async (_) => {
            setIsLoading(true);
            const data = await getSessionInfo(userId);
            const questionId = data.session.questionId;
            const question = await getQuestionInfo(questionId);
            setQuestion(question);
            setIsLoading(false);
        });

        socket.on("disconnectUser", async (_) => {
            setIsDisconnectPopupOpen(true);
        });
    }, [userId]);


    return (
        <>
            <Header
                partnerName={partnerName}
                partnerProfPicUrl={partnerProfPicUrl}
                ownProfPicUrl={ownProfPicUrl}
                onShuffleQuestion={handleShuffleQuestion}
                onConfirmDisconnect={handleConfirmDisconnect}
            />
            <Box height="90vh" sx={{ ml: 2, mr: 2, display: 'flex' }}>
                <Split
                    sizes={[35, 65]}
                    minSize={400}
                    direction="horizontal"
                    style={{ display: 'flex', width: '100%' }}
                    gutter={(index, direction) => {
                        const gutterElement = document.createElement('div');
                        gutterElement.className = `custom-gutter-col ${direction}`;
                        const root = createRoot(gutterElement);
                        root.render(
                            <DragHandleIcon
                                style={{
                                    transform: 'rotate(90deg)',
                                    fontSize: '24px',
                                    color: 'gray',
                                    height: '100%',
                                }}
                            />
                        );
                        return gutterElement;
                    }}
                >
                    {/* Question Panel and Chat Section */}
                    <Box width="100%" height="100%">
                        <Split
                            sizes={[55, 45]}
                            minSize={200}
                            direction="vertical"
                            style={{ height: '100%' }}
                            gutter={(index, direction) => {
                                const gutterElement = document.createElement('div');
                                gutterElement.className = `custom-gutter-row ${direction}`;
                                const root = createRoot(gutterElement);
                                root.render(
                                    <DragHandleIcon
                                        style={{
                                            fontSize: '24px',
                                            color: 'gray',
                                            width: '100%',
                                        }}
                                    />
                                );
                                return gutterElement;
                            }}
                        >
                            <Box width="100%" height="100%">
                                {isLoading ? (
                                    <Paper sx={{ bgcolor: 'background.paper', boxShadow: 24, p: 2, height: '100%', overflowY: 'auto' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                                            <CircularProgress color="secondary" />
                                            <Typography variant="body1" component="h2" sx={{ color: 'white', marginTop: 1 }}>
                                                Shuffling...
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ) : (
                                    <QuestionPanel
                                        key={question?.question_id}
                                        id={question?.question_id ?? 0}
                                        title={question?.question_title ?? ''}
                                        description={question?.question_description ?? ''}
                                        example={question?.question_example ?? []}
                                        categories={question?.question_categories ?? []}
                                        complexity={question?.question_complexity ?? ''}
                                        popularity={question?.question_popularity ?? 0}
                                    />
                                )}
                            </Box>

                            <Box width="100%" height="100%">
                                <ChatComponent
                                    sessionId={sessionId}
                                    partnerProfPicUrl={partnerProfPicUrl}
                                    ownProfPicUrl={ownProfPicUrl} />
                            </Box>
                        </Split>
                    </Box>

                    {/* Code Editor */}
                    <Box width="100%">
                    {sessionId === '' || template === '' ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                }}>
                                <CircularProgress color="secondary" />
                            </Box>
                        ) : (
                            <CodeEditor
                                sessionId={sessionId}
                                template={template}
                                onConfirmSubmission={handleConfirmSubmit}
                                onCodeChange={setCode}
                            />
                        )}
                    </Box>
                </Split>
            </Box>

            <Popup
                isOpen={isDisconnectPopupOpen}
                onConfirmDisconnect={handleConfirmDisconnectAsWell}
                onCloseDisconnect={handleCloseDisconnect}
                title="Disconnect room?"
                description={`${partnerName} has disconnected. Please confirm to disconnect as well.`}
                option={[null, "Disconnect"]}
            />
            <Popup
                isOpen={sessionNotFoundOpen}
                onConfirmDisconnect={handleSessionInactive}
                onCloseDisconnect={() => setSessionNotFoundOpen(false)}
                title="Session not found"
                description={`It seems that the session is not found. Please return to dashboard.`}
                option={[null, "return to dashboard"]}
            />
            <style>{`
                .custom-gutter-col {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: col-resize;
                    transition: background-color 0.3s;
                }

                .custom-gutter-row {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: row-resize;
                    transition: background-color 0.3s;
                }
            `}</style>
        </>
    );
};

export default CollaborationPage;
