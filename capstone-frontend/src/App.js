import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from './contexts/UserContext';
import { BudgetProvider } from './contexts/BudgetContext';
import AppRoutes from './routes/AppRoutes';

const theme = createTheme({
  palette: {
    primary: { main: '#E3F2FD' },
    secondary: { main: '#ebf4fa' }
  },
  typography: {
    fontFamily: "'Poppins', 'Quicksand', 'Nunito', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <BudgetProvider>
          <UserProvider>
            <Router>
              <AppRoutes />
            </Router>
          </UserProvider>
        </BudgetProvider>
    </ThemeProvider>
  );
}

export default App;
