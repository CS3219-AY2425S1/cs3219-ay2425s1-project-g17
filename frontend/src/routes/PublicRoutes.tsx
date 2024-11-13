import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/PublicNavbar";
import { LandingPage, NotFoundPage, LearnMorePage } from "../pages/miscellaneous";
import { LoginPage, RegisterPage } from "../pages/authentication";

export const PublicRoutes = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { isAuthenticated } = authContext;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/learn" element={<LearnMorePage />} />
                <Route path="/collaboration"/>
                <Route path="/dashboard"/>
                <Route path="/profile"/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default PublicRoutes;