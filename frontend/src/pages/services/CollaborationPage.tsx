import React from 'react';
import Split from 'react-split';
import { createRoot } from 'react-dom/client';
import CodeEditor from '../../components/collaborationpage/CodeEditor';
import QuestionPanel from '../../components/collaborationpage/QuestionPanel';
import Header from '../../components/collaborationpage/Header';
import { Box } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const CollaborationPage = () => {
    return (
        <>
            <Header />
            <Box height="90vh"
            sx={{
                ml: 2,
                mr: 2,
            }}>
                <Split
                    sizes={[50, 50]} 
                    minSize={500} 
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
                        <QuestionPanel />
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
