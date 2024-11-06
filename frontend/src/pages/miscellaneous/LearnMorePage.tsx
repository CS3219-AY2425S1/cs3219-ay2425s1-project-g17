import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '90vh',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
}));

const FeatureBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing(3),
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    marginBottom: theme.spacing(3),
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const LearnMore = () => {
    const navigate = useNavigate();
    return (
        <StyledContainer>
            <Typography variant="h4" component="h1" sx={{ marginBottom: '20px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>
                Learn More About Our Platform
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', color: 'gray' }}>
                Our platform is designed to help you prepare for technical interviews effectively and efficiently. 
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: '20px', textAlign: 'center', color: 'gray' }}>
            Below are some of the features and resources we offer.
            </Typography>

            <Box sx={{ justifyContent: 'center', textAlign: 'left', maxWidth: '800px' }}>
                <Box>
                    <FeatureBox>
                        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: 'white' }}>
                            Features:
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            - Extensive question repository with a variety of technical topics.
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            - Real-time coding collaboration tools.
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            - Access to peers collaborating on the same question.
                        </Typography>
                    </FeatureBox>
                </Box>

                <Box>
                    <FeatureBox>
                        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: 'white' }}>
                            How to Get Started:
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            1. Create an account to access all features.
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            2. Browse our question repository to practice.
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: '10px', color: 'white' }}>
                            3. Join coding sessions with peers for collaborative learning.
                        </Typography>
                    </FeatureBox>
                </Box>
            </Box>

            <Button variant="contained" color="secondary" onClick={() => navigate('/register')} sx={{ marginTop: '20px', color: "white"}} >
                Get Started
            </Button>
        </StyledContainer>
    );
};

export default LearnMore;
