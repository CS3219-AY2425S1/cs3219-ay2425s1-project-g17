import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SpeedIcon from '@mui/icons-material/Speed';
import { motion } from 'framer-motion';

const Features = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '10vh',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5 }}>
                    <Typography variant="h4" sx={{ color: '#9AC143', textAlign: 'Left' }}>
                        <b>Our Features</b>
                    </Typography>
                </Box>
            </motion.div>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 15,
                    mt: 5,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <GroupsIcon sx={{ fontSize: 100, color: 'white' }} />
                        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                            Real-Time Collaboration
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <QuestionAnswerIcon sx={{ fontSize: 100, color: 'white' }} />
                        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                            Extensive Question Bank
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <SpeedIcon sx={{ fontSize: 100, color: 'white' }} />
                        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                            Speedy Performance
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        </Container>
    );
};

export default Features;
