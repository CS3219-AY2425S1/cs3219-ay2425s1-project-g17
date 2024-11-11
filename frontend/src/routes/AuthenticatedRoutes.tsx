import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getSignedImageURL } from '../services/user-service/UserService';

import Navbar from "../components/AuthenticatedNavbar";
import NotFoundPage from "../pages/miscellaneous/NotFoundPage";
import ProfilePage from "../pages/miscellaneous/ProfilePage";
import DashboardPage from "../pages/DashboardPage";
import CollaborationPage from "../pages/services/CollaborationPage";
import Footer from "../components/landingpage/Footer";

export const AuthenticatedRoutes = () => {
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const { isAuthenticated } = authContext;

    const isCollabPage = location.pathname === '/collaboration';

    const setHeaderProfileImageUrl = (url : string) => {
        setProfileImageUrl(url);
    };

    useEffect(() => {
        const getUserProfilePic = async (imageName : string) => {
            if (!isAuthenticated) return;
            try {
                const response = await getSignedImageURL(imageName);
                setProfileImageUrl(response);
            } catch (err : any) {
                alert(err.message);
            }
        };
        getUserProfilePic(localStorage.getItem('profileImage') || '');
    }, [isAuthenticated]);

    // Redirect to the login page if the user is not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {!isCollabPage && <Navbar profileImageUrl={profileImageUrl}/>}
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage setHeaderProfileImageUrl={setHeaderProfileImageUrl} />} />
                <Route path="/collaboration" element={<CollaborationPage />} />
                <Route path="/login" />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            {!isCollabPage && <Footer />}
        </>
    );
};

export default AuthenticatedRoutes;
