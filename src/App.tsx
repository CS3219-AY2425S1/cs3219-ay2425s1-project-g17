import React from 'react';
import QuestionPage from './pages/QuestionPage';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';

function App() {
  // Define the theme options with correct type for 'mode'
  const themeOptions: ThemeOptions = {
    palette: {
      mode: 'dark', // Explicitly use 'dark' instead of a general string type
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
      <QuestionPage />
    </ThemeProvider>
  );
}

export default App;
