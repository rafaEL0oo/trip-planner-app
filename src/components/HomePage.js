import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Hotel as HotelIcon,
  DirectionsRun as ActivityIcon,
  FlightTakeoff as FlightIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <HotelIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Hotel Discovery',
      description: 'Share hotel options and let friends vote with thumbs up, down, or heart reactions',
    },
    {
      icon: <ActivityIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Activity Planning',
      description: 'Rate activities from "Not Interested" to "Must Do!" with descriptive labels',
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Travel Sharing',
      description: 'Generate unique URLs to share your trip with friends instantly',
    },
    {
      icon: <ExploreIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Explore Together',
      description: 'Collaborate on trip planning with real-time voting and comments',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, sm: 5, md: 6 },
          mb: 4,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #81C784 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          mx: { xs: 2, sm: 0 },
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
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 }
          }}>
            <FlightIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: 'rgba(255, 255, 255, 0.9)' }} />
            <Typography variant="h2" component="h1" sx={{ 
              mb: 0,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textAlign: 'center'
            }}>
              Trip Planner
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ 
            mb: 4, 
            opacity: 0.9,
            fontSize: { xs: '1.2rem', sm: '1.5rem' }
          }}>
            Plan your perfect adventure with friends
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-2px)',
              },
              px: 4,
              py: 1.5,
            }}
          >
            Start Your Journey
          </Button>
        </Box>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
          ✈️ Your Travel Planning Journey
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3}
              key={index}
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                maxWidth: { xs: '100%', sm: '400px', md: '350px' }
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box textAlign="center" sx={{ mt: { xs: 4, sm: 6 } }}>
          <Typography variant="h5" gutterBottom sx={{ 
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            mb: 3
          }}>
            Ready to start planning?
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            sx={{ 
              px: { xs: 3, sm: 4 }, 
              py: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '300px', sm: 'none' }
            }}
          >
            Create Your First Trip
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
