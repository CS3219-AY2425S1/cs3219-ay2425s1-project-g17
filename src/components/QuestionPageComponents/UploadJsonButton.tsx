import * as React from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';

const codeBlockProps = {
    language: "json",
    showLineNumbers: true,
    wrapLongLines: true,
    theme: dracula,
    code: '{\n  "questions": [\n        {\n         "question_id": 1,\n            "question_title": "Add Binary",\n            "question_description": "Given two binary strings a and b, return their sum as a binary string.",\n            "question_categories": ["Bit Manipulation", "Algorithms"],\n            "question_complexity": "Easy",\n            "popularity": 10\n        },\n        {\n            "question_id": 2,\n            "question_title": "LRU Cache Design",\n            "question_description": "Design and implement an LRU (Least Recently Used) cache.",\n            "question_categories": ["Data Structures"],\n            "question_complexity": "Medium",\n            "popularity": 25\n        }\n    ]\n}',
}

const api = axios.create({
    baseURL: "/* TODO */", // TODO
    timeout: 5000,
})

const UploadJsonButton = () => {
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleAxiosError(error: any) {
        console.error('An error occurred:', error.message);
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        console.log(formData);

        try {
            const response = await api.post("/", formData);
            handleClose();
            return response.data;
        } catch (error) {
            console.log(file?.name);
            handleAxiosError(error);
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
                        width: 1050,
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
                    <CopyBlock
                        language={codeBlockProps.language}
                        showLineNumbers={codeBlockProps.showLineNumbers}
                        wrapLongLines={codeBlockProps.wrapLongLines}
                        theme={codeBlockProps.theme}
                        text={codeBlockProps.code}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Stack>
                            <input 
                                id="file" 
                                type="file"
                                accept="application/json"
                                style={{ color: 'white' }}
                                onChange={ handleFileChange }
                            />
                            <Button
                                component="label"
                                variant="contained"
                                color="secondary"
                                sx={{ color: 'white', mt: 2 }}
                                startIcon={<CloudUploadIcon />}
                                onClick={ handleUpload }
                            >
                                Upload File
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default UploadJsonButton;