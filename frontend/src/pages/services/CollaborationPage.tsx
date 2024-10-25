import React, { useState } from 'react';
import Split from 'react-split';
import { createRoot } from 'react-dom/client';
import CodeEditor from '../../components/collaborationpage/CodeEditor';
import QuestionPanel from '../../components/collaborationpage/QuestionPanel';
import Header from '../../components/collaborationpage/Header';
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { getSessionInfo, getQuestionInfo, disconnectUser, submitAttempt } from '../../services/collaboration-service/CollaborationService';
import { getSignedImageURL } from '../../services/user-service/UserService';
import socket from "../../context/socket"
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/collaborationpage/Popup';

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
    
    const [question, setQuestion] = React.useState<QuestionProps | null>(null);
    const [partnerName, setPartnerName] = React.useState('');
    const [partnerProfPicUrl, setPartnerProfPicUrl] = React.useState('');
    const [ownProfPicUrl, setOwnProfPicUrl] = React.useState('');
    const [sessionId, setSessionId] = React.useState('');
    const [isDisconnectPopupOpen, setIsDisconnectPopupOpen] = useState(false);
    const [isSubmissionPopupOpen, setIsSubmissionPopupOpen] = useState(false);

    const userId = localStorage.getItem('id') || '';
    const ownProfPic = localStorage.getItem('profileImage') || '';

    const navigate = useNavigate();

    const handleShuffleQuestion = (newData: QuestionProps) => {
        setQuestion(newData); 
        socket.emit("shuffleQuestion", sessionId);
    };

    // Function for user that click disconnect on their own
    const handleConfirmDisconnect = () => {
        socket.emit("disconnectUser", {sessionId, userId});
    };

    // Function for user that click disconnect when other user disconnects first
    const handleConfirmDisconnectAsWell = () => {
        disconnectUser(userId);
        navigate('/dashboard');
        return
    }

    const handleConfirmSubmission = () => {
        socket.emit("submit", sessionId);
    };

    const handleSubmitForBothUser = () => {
        // TODO: Save attempt (History Service)
        submitAttempt(sessionId);
        socket.emit("confirmSubmit", sessionId);
        navigate('/dashboard');
    }

    const handleCloseDisconnect = () => {
        setIsDisconnectPopupOpen(false);
    };

    const handleCloseSubmission = () => {
        setIsSubmissionPopupOpen(false);
    };

    React.useEffect(() => {
        async function fetchSessionInfo() {
            try {
                const data = await getSessionInfo(userId);
                const questionId = data.session.questionId;
                
                const question = await getQuestionInfo(questionId);
                setQuestion(question);
                setPartnerName(data.session.partner);

                const partnerProfPic = data.session.partner_pic;
                const partnerProfPicUrl = await getSignedImageURL(partnerProfPic);
                setPartnerProfPicUrl(partnerProfPicUrl);

                const ownProfPicUrl = await getSignedImageURL(ownProfPic);
                setOwnProfPicUrl(ownProfPicUrl);

                setSessionId(data.sessionId);
                const roomId = data.sessionId
                socket.emit('joinSession', { userId, roomId });
                console.log(data.session);
            } catch (error) {
                console.error('Failed to fetch session:', error);
            }
        }
        fetchSessionInfo();
    }, []);

    React.useEffect(() => {
        socket.on("shuffle", async (_) => {
            const data = await getSessionInfo(userId);
            const questionId = data.session.questionId;
            const question = await getQuestionInfo(questionId);
            setQuestion(question);
        });

        socket.on("disconnectUser", async (_) => {
            setIsDisconnectPopupOpen(true);
        });

        socket.on("submit", async (_) => {
            setIsSubmissionPopupOpen(true);
        });

        socket.on("confirmSubmit", async (_) => {
            navigate('/dashboard');
        });
      }, [socket]);


    return (
        <>
            <Header 
                partnerName={partnerName}
                partnerProfPicUrl={partnerProfPicUrl}
                ownProfPicUrl={ownProfPicUrl}
                onShuffleQuestion={handleShuffleQuestion}
                onConfirmDisconnect={handleConfirmDisconnect}
            />
            <Box height="90vh"
            sx={{
                ml: 2,
                mr: 2,
            }}>
                <Split
                    sizes={[35, 65]} 
                    minSize={400} 
                    direction="horizontal"
                    style={{ display: 'flex' }}
                    gutter={(index, direction) => {
                        const gutterElement = document.createElement('div');
                        gutterElement.className = `custom-gutter ${direction}`;
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
                    <Box width="100%">
                    <QuestionPanel
                        id={question?.question_id ?? 0} 
                        title={question?.question_title ?? ''}
                        description={question?.question_description ?? ''}
                        example={question?.question_example ?? []} 
                        categories={question?.question_categories ?? []}
                        complexity={question?.question_complexity ?? ''}
                        popularity={question?.question_popularity ?? 0}
                    />
                    </Box>
                    <Box width="100%">
                        <CodeEditor
                            onConfirmSubmission={handleConfirmSubmission}
                        />
                    </Box>
                </Split>
            </Box>
            <Popup
                isOpen={isDisconnectPopupOpen}
                onConfirmDisconnect={handleConfirmDisconnectAsWell}
                onCloseDisconnect ={handleCloseDisconnect}
                title="Disconnect room?"
                description={`${partnerName} has disconnected. Do you wish to disconnect?`}
                option ={["Cancel", "Disconnect"]}
            />
            <style>{`
                .custom-gutter {
                    display: flex;
                    justify-content: center;
                    align-items: center; /* Centers the icon vertically */
                    cursor: col-resize;
                    transition: background-color 0.3s;
            }

            `}</style>
        </>
    );
};

export default CollaborationPage;
