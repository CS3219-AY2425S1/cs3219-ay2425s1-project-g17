import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Navbar from "../components/AuthenticatedNavbar";
import QuestionPage from "../pages/services/QuestionPage";
import NotFoundPage from "../pages/miscellaneous/NotFoundPage";
import ProfilePage from "../pages/miscellaneous/ProfilePage";
import MatchingPage from "../pages/services/MatchingPage";

// TODO: Add collaboration and matching pages here
export const AuthenticatedRoutes = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { isAuthenticated } = authContext;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<QuestionPage />} />
                <Route path="/dashboard" element={<QuestionPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login"/>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default AuthenticatedRoutes;
