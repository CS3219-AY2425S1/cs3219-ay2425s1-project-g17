import React, { createContext, useState, useEffect } from 'react';
import { verifyToken, getUserDetails } from '../services/user-service/UserService';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, email: string, newToken: string, id: string, profileImage: string) => void;
    logout: () => void;
    updateUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Verifies token on initial load
    useEffect(() => {
        const verifyAuthToken = async () => {
            if (token) {
                try {
                    const response = await verifyToken(token);
                    setIsAuthenticated(!!response);
                } catch (error) {
                    console.error("Token verification failed:", error);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        verifyAuthToken();
    }, [token]);

    const login = (username: string, email: string, newToken: string, id: string, profileImage: string) => {
        setToken(newToken);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('token', newToken); 
        localStorage.setItem('id', id);
        localStorage.setItem('profileImage', profileImage)
        setIsAuthenticated(true);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('profileImage');
        localStorage.removeItem('profileImageUrl');
        localStorage.removeItem('profileImageUrlExpiry');
        setIsAuthenticated(false);
    };

    // Fetch updated user data and update localStorage and state
    const updateUserData = async () => {
        try {
            const userId = localStorage.getItem('id');
            if (token && userId) {
                const userDetails = await getUserDetails(userId, token);
                if (userDetails) {
                    localStorage.setItem('username', userDetails.data.username);
                    localStorage.setItem('email', userDetails.data.email);
                }
            }
        } catch (error) {
            console.error("Failed to update user data:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
