import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/AppRoutes'; // ✅ Import AppRoutes
import { BudgetProvider } from './contexts/BudgetContext';

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#ff5722' }
  }
});



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <BudgetProvider value={{}}>
        <Router>
          <AppRoutes /> 
        </Router>
        </BudgetProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
