import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';

const Testimonials = () => {
    const testimonials = [
        {
            name: 'James Tan',
            role: 'Y3 NUS Computer Science Student',
            feedback: 'I secured an internship at Google after using this platform for 3 months. It really boosted my interview preparation skills!',
            rating: 5,
        },
        {
            name: 'Wei Ling Chen',
            role: 'Y2 NTU Information Systems Student',
            feedback: 'The real-time coding collaboration helped me improve significantly in pair programming and got me an internship!',
            rating: 5,
        },
        {
            name: 'Rajesh Kumar',
            role: 'Y4 SMU Software Engineering Student',
            feedback: 'I loved the structured question repository. It made my interview prep much more organised and effective.',
            rating: 4,
        },
    ];

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '70vh',
            }}
        >
            <Box sx={{ marginBottom: '30px', textAlign: 'left' }}>
                <Typography variant="h4" sx={{ color: '#9AC143', fontWeight: 'bold' }}>
                    Our Testimonials
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 4,
                }}
            >
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <Paper
                            sx={{
                                width: '300px',
                                padding: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '15px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                textAlign: 'center',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                <AccountCircleIcon sx={{ fontSize: 60, color: 'white' }} />
                            </Box>
                            <Typography sx={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>
                                {testimonial.name}
                            </Typography>
                            <Typography sx={{ color: 'white', fontStyle: 'italic', marginBottom: '15px' }}>
                                {testimonial.role}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                                {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                                    <StarIcon key={starIndex} sx={{ fontSize: 24, color: 'yellow' }} />
                                ))}
                            </Box>

                            <Typography variant="body1" sx={{ color: 'white', textAlign: 'justify' }}>
                                {testimonial.feedback}
                            </Typography>
                        </Paper>
                    </motion.div>
                ))}
            </Box>
        </Container>
    );
};

export default Testimonials;
