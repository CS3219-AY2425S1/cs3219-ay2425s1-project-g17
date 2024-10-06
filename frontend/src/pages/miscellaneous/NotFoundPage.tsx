// src/components/NotFoundPage.tsx
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
                textAlign: 'center',
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: '100px', color: 'error.main', marginBottom: '20px' }} />
            <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 'bold' }}>
                404 Error
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleGoHome}
                sx={{ padding: '10px 20px' }}
            >
                Go to Home
            </Button>
        </Container>
    );
};

export default NotFoundPage;
