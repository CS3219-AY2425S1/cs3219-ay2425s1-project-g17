import CodeEditor from '../../components/collaborationpage/CodeEditor';
import QuestionPanel from '../../components/collaborationpage/QuestionPanel';
import { Box } from '@mui/material';

const CollaborationPage = () => {
    return (
        <Box 
            display="flex" 
            height="100vh" 
        >
            <Box width="50%">
                <QuestionPanel />
            </Box>
            <Box width="50%">
                <CodeEditor />
            </Box>
        </Box>
    );
};

export default CollaborationPage;
