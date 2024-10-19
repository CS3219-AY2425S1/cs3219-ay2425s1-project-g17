import React from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
    return (
        <Container>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '30vh',
                    textAlign: 'center',
                    marginY: 5,
                    borderRadius: '20px',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
                        Ready to get started?
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'white', maxWidth: '600px' }}>
                        Join our community and enhance your coding skills with our unique platform.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            color: 'white',
                        }}
                        onClick={() => {
                            window.location.href = '/register';
                        }}
                    >
                        Sign Up, It's Free
                    </Button>
                </motion.div>
            </Paper>
        </Container>
    );
};

export default CallToAction;
