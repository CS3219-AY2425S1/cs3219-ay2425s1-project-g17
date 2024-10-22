import React from 'react';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthenticatedRoutes, PublicRoutes } from './routes/';
import { AuthProvider, AuthContext } from "./context/AuthContext";

function App() {
  const themeOptions: ThemeOptions = {
    typography: {
      fontFamily: 'FontAwesome, Roboto, sans-serif, Arial, JetBrains Mono',
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#EEEEEE',
      },
      secondary: {
        main: '#00ADB5',
      },
      background: {
        default: '#222831',
        paper: '#222831',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#FFFFFF',
      },
    },
  };

  const theme = createTheme(themeOptions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AuthContext.Consumer>
            {context => {
              if (!context) {
                return null;
              }

              const { isAuthenticated } = context;
              return isAuthenticated ? <AuthenticatedRoutes /> : <PublicRoutes />;
            }}
          </AuthContext.Consumer>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;


  // #9AC143 green