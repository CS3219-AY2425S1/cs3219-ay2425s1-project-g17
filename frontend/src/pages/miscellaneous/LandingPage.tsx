import React from 'react';
import { Hero, Features, Testimonials, CallToAction, Footer, Showcase } from '../../components/landingpage';
import { Container } from '@mui/material';

const LandingPage = () => {
    return (
        <>
            <Hero />
            <Container>
                <Showcase />
                <Features />
                <Testimonials />
            </Container>
            <CallToAction />
            <Footer />
        </>
    );
}
export default LandingPage;