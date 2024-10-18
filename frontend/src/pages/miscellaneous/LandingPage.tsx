import React from 'react';
import { Hero, Features, Testimonials } from '../../components/landingpage';
import { Container } from '@mui/material';

const LandingPage = () => {
    return (
        <>
            <Hero />
            <Container>
                <Features />
                <Testimonials />
            </Container>
        </>
    );
}

export default LandingPage;