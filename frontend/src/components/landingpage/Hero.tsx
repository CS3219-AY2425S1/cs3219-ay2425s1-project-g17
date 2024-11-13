import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import HeroImage from '../../assets/Herobg.jpg';
import Logo from '../../assets/Logo black.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    const navigate = useNavigate();

    const handleJoinUs = () => {
        navigate('/register');
    };

    const handleLearnMore = () => {
        navigate('/learn');
    };

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
                <motion.img
                    src={Logo}
                    alt="Logo"
                    style={{ height: '20vh' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} 
                    transition={{ duration: 1 }}
                />

                <Box sx={{ ml: 5 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <Typography variant="h4" sx={{ color: 'black', textAlign: 'Left' }}>
                            <b>Prepare for Technical Interviews with Confidence</b>
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'Left' }}>
                            Collaborate with peers, practice coding challenges and ace your interviews
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ color: 'white', mt: 2 }}
                                onClick={handleJoinUs}
                            >
                                Join Us Now
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ color: 'black', mt: 2 }}
                                onClick={handleLearnMore}
                            >
                                Learn More
                            </Button>
                        </Box>
                    </motion.div>
                </Box>
            </Box>
        </Container>
    );
};

export default Hero;
