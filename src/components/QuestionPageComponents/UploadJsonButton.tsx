import * as React from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { CopyBlock, dracula } from 'react-code-blocks';
import { uploadJson } from '../../controller/question-service/QuestionService';

const codeBlockProps = {
    language: "json",
    showLineNumbers: true,
    wrapLongLines: false,
    theme: dracula,
    code: '{\n  "questions": [\n        {\n            "question_title": "Add Binary",\n            "question_description": "Given two binary strings a and b, return their sum as a binary string.",\n            "question_categories": ["Bit Manipulation", "Algorithms"],\n            "question_complexity": "EASY",\n            "popularity": 10\n        },\n        {\n            "question_title": "LRU Cache Design",\n            "question_description": "Design and implement an LRU (Least Recently Used) cache.",\n            "question_categories": ["Data Structures"],\n            "question_complexity": "MEDIUM",\n            "popularity": 25\n        }\n    ]\n}',
}

const UploadJsonButton = () => {
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            handleShow();
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        try {
            const jsonUpload = await uploadJson(formData);
            if (jsonUpload) { 
                alert('JSON file uploaded successfully.');
            } else {
                alert('Error with JSON file, please try again with another JSON file.');
            }
            handleClose();
        } catch (error) {
            alert('Failed to upload JSON file.');
        }
    }

    return (
        <Box>
          <Button
                variant="contained"
                color="secondary"
                startIcon={<UploadFileIcon />}
                sx={{ color: 'white' }}
                onClick={handleOpen}
            >
            Upload JSON
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aira-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ color: 'white' }}>
                        Upload JSON file
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'white', mt: 2 }}>
                        Example JSON file
                    </Typography>
                    <Box sx={{ overflowX: 'auto', maxWidth: '100%', fontSize: "12px", display: 'flex' }}>
                    <CopyBlock
                        language={codeBlockProps.language}
                        showLineNumbers={codeBlockProps.showLineNumbers}
                        wrapLongLines={codeBlockProps.wrapLongLines}
                        theme={codeBlockProps.theme}
                        text={codeBlockProps.code}
                    />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Stack>
                            <input 
                                id="file" 
                                type="file"
                                accept="application/json"
                                style={{ color: 'white' }}
                                onChange={ handleFileChange }
                            />
                            {file && show && <Button
                                component="label"
                                variant="contained"
                                color="secondary"
                                sx={{ color: 'white', mt: 2 }}
                                startIcon={<CloudUploadIcon />}
                                onClick={ handleUpload }
                            >
                                Upload File
                            </Button>}
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default UploadJsonButton;