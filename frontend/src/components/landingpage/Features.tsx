import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SpeedIcon from '@mui/icons-material/Speed';

const Features = () => {


    return (
        <Container
            maxWidth={false}
            sx={{
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '40vh',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 5,
                }}
            >
                <Typography variant="h4" sx={{ color: 'white', textAlign: 'Left' }}>
                    <b>Our Features</b>
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 15,
                    mt: 5,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GroupsIcon sx={{ fontSize: 100, color: 'white' }} />
                    <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Real-Time Collaboration</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <QuestionAnswerIcon sx={{ fontSize: 100, color: 'white' }} />
                    <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Extensive Question Bank</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SpeedIcon sx={{ fontSize: 100, color: 'white' }} />
                    <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Speedy Performance</Typography>
                </Box>

            </Box>

        </Container >
    );
};

export default Features;
