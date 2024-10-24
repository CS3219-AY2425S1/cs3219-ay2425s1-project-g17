import React from 'react';
import Split from 'react-split';
import { createRoot } from 'react-dom/client';
import CodeEditor from '../../components/collaborationpage/CodeEditor';
import QuestionPanel from '../../components/collaborationpage/QuestionPanel';
import Header from '../../components/collaborationpage/Header';
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { getSessionInfo, getQuestionInfo } from '../../services/collaboration-service/CollaborationService';

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

    const userId = localStorage.getItem('id') || '';

    React.useEffect(() => {
        async function fetchSessionInfo() {
            try {
                const data = await getSessionInfo(userId);
                const questionId = data.session.questionId;

                const question = await getQuestionInfo(questionId);
                setQuestion(question);


                console.log(question);
                console.log(data.session);
            } catch (error) {
                console.error('Failed to fetch session:', error);
            }
        }
        fetchSessionInfo();
    }, []);


    return (
        <>
            <Header />
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
                        <CodeEditor />
                    </Box>
                </Split>
            </Box>

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
