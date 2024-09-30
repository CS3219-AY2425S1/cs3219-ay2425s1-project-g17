import { Route, Routes } from "react-router-dom";

import Navbar from "../components/PublicNavbar";
import { LandingPage, NotFoundPage, LearnMorePage } from "../pages/miscellaneous";
import { LoginPage, RegisterPage } from "../pages/authentication";

export const PublicRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/learn" element={<LearnMorePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default PublicRoutes;