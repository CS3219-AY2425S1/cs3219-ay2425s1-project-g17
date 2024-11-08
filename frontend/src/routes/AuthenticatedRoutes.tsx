import React, { useContext } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/AuthenticatedNavbar";
import NotFoundPage from "../pages/miscellaneous/NotFoundPage";
import ProfilePage from "../pages/miscellaneous/ProfilePage";
import DashboardPage from "../pages/DashboardPage";
import CollaborationPage from "../pages/services/CollaborationPage";
import Footer from "../components/landingpage/Footer";

export const AuthenticatedRoutes = () => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { isAuthenticated } = authContext;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const isCollabPage = location.pathname === '/collaboration';

    return (
        <>
            {!isCollabPage && <Navbar />}
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/collaboration" element={<CollaborationPage />} />
                <Route path="/login"/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {!isCollabPage && <Footer />}
        </>
    );
};

export default AuthenticatedRoutes;
