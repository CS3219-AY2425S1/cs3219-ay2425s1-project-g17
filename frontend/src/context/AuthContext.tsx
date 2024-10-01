import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../services/user-service/UserService';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (username: string, email: string, newToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

    const login = (username: string, email: string, newToken: string) => {
        setToken(newToken);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('token', newToken); 
        setIsAuthenticated(true);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
