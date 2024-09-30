import React from 'react';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthenticatedRoutes, PublicRoutes } from './routes/';

function App() {

  // TODO: Implement authentication
  const isAuth = false;

  const themeOptions: ThemeOptions = {
    typography: {
      fontFamily: 'Roboto, sans-serif, Arial, JetBrains Mono',
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
      <BrowserRouter>
        {isAuth ? <AuthenticatedRoutes /> : <PublicRoutes />}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
