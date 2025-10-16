import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, CircularProgress, Box } from '@mui/material';

// Components
import HomePage from './components/HomePage';
import CreateTrip from './components/CreateTrip';
import TripPage from './components/TripPage';
import Login from './components/Login';

// Context
import { UserProvider, useUser } from './contexts/UserContext';

// Create a travel-themed design
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Travel green
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6F00', // Sunset orange
      light: '#FFB74D',
      dark: '#E65100',
    },
    tertiary: {
      main: '#1976D2', // Sky blue
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    info: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#2E7D32',
    },
    h2: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h3: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h4: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h5: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    h6: {
      fontWeight: 600,
      color: '#2E7D32',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(46, 125, 50, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(46, 125, 50, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const AppContent = () => {
  const { user, login, loading } = useUser();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Login onLogin={login} loading={false} />;
  }

  return (
    <Router>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateTrip />} />
          <Route path="/trip/:tripId" element={<TripPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;