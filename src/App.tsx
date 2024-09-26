import React from 'react';
import QuestionPage from './pages/QuestionPage';
import CodeEditor from './components/CodeEditor';
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
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
      <QuestionPage />
      <CodeEditor />
    </ThemeProvider>
  );
}

export default App;
