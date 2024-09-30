import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import HeroImage from '../../assets/Herobg.jpg';
import Logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {

    const navigate = useNavigate();

    const handleJoinUs = () => {
        navigate('/register');
    }

    const handleLearnMore = () => {
        navigate('/learn');
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                backgroundImage: `url(${HeroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: 'background.default',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img src={Logo} alt="Logo" style={{ height: '20vh' }} />
                <Box sx={{ ml: 5 }}>
                    <Typography variant="h4" sx={{ color: 'black', textAlign: 'Left' }}>
                        <b>Prepare for Technical Interviews with Confidence</b>
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'black', textAlign: 'Left' }}>
                        Collaborate with peers, practice coding challenges and ace your interviews
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ color: 'white', mt: 2 }}
                            onClick={() => handleJoinUs()}
                        >
                            Join Us Now
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ color: 'black', mt: 2 }}
                            onClick={() => handleLearnMore()}
                        >
                            Learn More
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Container >
    );
};

export default Hero;
