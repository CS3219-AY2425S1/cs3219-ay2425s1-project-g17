import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthContext } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthenticatedRoutes and PublicRoutes components
jest.mock('./routes/', () => ({
  AuthenticatedRoutes: () => <div>Authenticated Routes</div>,
  PublicRoutes: () => <div>Public Routes</div>,
}));

describe('App Component', () => {
  const renderWithAuthContext = (isAuthenticated: boolean) => {
    render(
      <AuthContext.Provider value={{ 
        isAuthenticated, 
        token: '', 
        login: jest.fn(), 
        logout: jest.fn(), 
        updateUserData: jest.fn() 
      }}>
          <App />
      </AuthContext.Provider>
    );
  };
  
  test('renders PublicRoutes when user is not authenticated', () => {
    renderWithAuthContext(false);
    expect(screen.getByText(/Public Routes/i)).toBeInTheDocument();
  });
});
