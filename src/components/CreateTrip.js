import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Save as SaveIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!tripData.title || !tripData.destination) {
        throw new Error('Title and destination are required');
      }

      const tripId = generateUniqueId();
      const trip = {
        ...tripData,
        id: tripId,
        createdAt: new Date(),
        hotels: [],
        activities: [],
        comments: [],
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'trips'), trip);
      console.log('Trip created with ID:', docRef.id);

      // Navigate to the trip page
      navigate(`/trip/${tripId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Create New Trip
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
                label="Trip Title"
                name="title"
                value={tripData.title}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Summer Vacation 2024"
              />

              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={tripData.destination}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                placeholder="e.g., Paris, France"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={tripData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ mb: 3 }}
                placeholder="Tell your friends about this trip..."
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={tripData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={tripData.endDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{ flex: 1 }}
                />
              </Box>


              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? 'Creating Trip...' : 'Create Trip'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default CreateTrip;
