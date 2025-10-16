import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person as PersonIcon, Login as LoginIcon, FlightTakeoff as FlightIcon } from '@mui/icons-material';

const Login = ({ onLogin, loading }) => {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    onLogin(userName.trim());
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    if (error) setError('');
  };

  return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #81C784 100%)',
          p: 2,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
      <Paper elevation={10} sx={{ p: 4, maxWidth: 400, width: '100%', position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <FlightIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
            <PersonIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
            Welcome to Trip Planner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your name to start planning amazing adventures with friends
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                value={userName}
                onChange={handleNameChange}
                required
                sx={{ mb: 3 }}
                placeholder="Enter your name"
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                disabled={loading || !userName.trim()}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? 'Starting your journey...' : 'Start Planning'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Your name will be saved for future visits
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
