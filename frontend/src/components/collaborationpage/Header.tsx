import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DisconnectIcon from '@mui/icons-material/PowerSettingsNew';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { getQuestionInfo } from '../../services/collaboration-service/CollaborationService';
import { shuffleQuestion } from '../../services/collaboration-service/CollaborationService';

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

interface HeaderProps {
    partnerName: string; 
    partnerProfPicUrl: string;
    ownProfPicUrl: string;
    onUpdateData: (newData: QuestionProps) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    partnerName, 
    partnerProfPicUrl, 
    ownProfPicUrl,
    onUpdateData
 }) => {

    const navigate = useNavigate();

    // TODO: Implement disconnect functionality
    const onDisconnect = () => {
        // Disconnect the user from the partner
        navigate('/dashboard');
        return;
    };

    // TODO: Implement shuffle functionality
    const onShuffleQuestions = async () => {
        const userId = localStorage.getItem('id') || '';
        const shuffleRes = await shuffleQuestion(userId);
        const newQuestionId = shuffleRes.question_id;
        const question = await getQuestionInfo(newQuestionId);
        console.log(question);
        onUpdateData(question);
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="8px"
            ml={1}
            mr={1}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onShuffleQuestions}
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    startIcon={<ShuffleIcon />}
                >
                    Shuffle Question
                </Button>
            </Box>

            <Typography color="textPrimary">
                You are connected with <strong>{partnerName}</strong>
            </Typography>
            <IconButton sx={{ p: 0 }}>
                <Avatar src={ownProfPicUrl} sx={{ bgcolor: "white" }} />
            </IconButton>
            <IconButton sx={{ p: 0 }}>
                <Avatar src={partnerProfPicUrl} sx={{ bgcolor: "white" }} />
            </IconButton>
            <Button
                variant="contained"
                color="error"
                onClick={onDisconnect}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                startIcon={<DisconnectIcon />}
            >
                Disconnect
            </Button>
        </Box>
    );
};

export default Header;
