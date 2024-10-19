import React from 'react';
import { Hero, Features, Testimonials, CallToAction, Footer } from '../../components/landingpage';
import { Container } from '@mui/material';

const LandingPage = () => {
    return (
        <>
            <Hero />
            <Container>
                <Features />
                <Testimonials />
            </Container>
            <CallToAction />
            <Footer />
        </>
    );
}
export default LandingPage;