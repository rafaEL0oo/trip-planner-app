import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Share as ShareIcon,
  Hotel as HotelIcon,
  DirectionsRun as ActivityIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  FlightTakeoff as FlightIcon,
} from '@mui/icons-material';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../contexts/UserContext';
import HotelPreview from './HotelPreview';

const TripPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [trip, setTrip] = useState(null);
  const [tripDocId, setTripDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [newHotelUrl, setNewHotelUrl] = useState('');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');
  const [newComments, setNewComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    loadTrip();
  }, [tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTrip = async () => {
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('id', '==', tripId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        navigate('/');
        return;
      }

      const doc = querySnapshot.docs[0];
      const tripData = doc.data();
      setTrip(tripData);
      setTripDocId(doc.id);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHotel = async () => {
    if (!newHotelUrl.trim() || !tripDocId) return;

    try {
      const hotel = {
        id: Date.now().toString(),
        url: newHotelUrl,
        votes: { dontLike: 0, like: 0, awesome: 0 },
        userVotes: {}, // Track individual user votes
        comments: [],
        addedAt: new Date(),
      };

      const updatedHotels = [...trip.hotels, hotel];
      const updatedTrip = {
        ...trip,
        hotels: updatedHotels,
      };

      // Update local state
      setTrip(updatedTrip);
      setNewHotelUrl('');

      // Save to Firebase
      const tripRef = doc(db, 'trips', tripDocId);
      await updateDoc(tripRef, {
        hotels: updatedHotels
      });

      console.log('Hotel added and saved to Firebase:', hotel);
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const addActivity = async () => {
    if (!newActivityName.trim() || !tripDocId) return;

    try {
      const activity = {
        id: Date.now().toString(),
        name: newActivityName,
        description: newActivityDescription,
        ratings: {},
        userRatings: {},
        averageRating: 0,
        comments: [],
        addedAt: new Date(),
      };

      const updatedActivities = [...trip.activities, activity];
      const updatedTrip = {
        ...trip,
        activities: updatedActivities,
      };

      // Update local state
      setTrip(updatedTrip);
      setNewActivityName('');
      setNewActivityDescription('');

      // Save to Firebase
      const tripRef = doc(db, 'trips', tripDocId);
      await updateDoc(tripRef, {
        activities: updatedActivities
      });

      console.log('Activity added and saved to Firebase:', activity);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const voteHotel = async (hotelId, voteType) => {
    if (!tripDocId) return;

    try {
      const updatedHotels = trip.hotels.map(hotel => {
        if (hotel.id === hotelId) {
          const newVotes = { ...hotel.votes };
          const newUserVotes = { ...hotel.userVotes };
          
          // Remove previous vote if exists
          const previousVote = newUserVotes[user.id];
          if (previousVote) {
            newVotes[previousVote] = Math.max(0, newVotes[previousVote] - 1);
          }
          
          // Add new vote
          if (voteType) {
            newVotes[voteType] = (newVotes[voteType] || 0) + 1;
            newUserVotes[user.id] = voteType;
          } else {
            // Remove vote (change decision to null)
            delete newUserVotes[user.id];
          }
          
          return { ...hotel, votes: newVotes, userVotes: newUserVotes };
        }
        return hotel;
      });

      // Update local state
      setTrip({ ...trip, hotels: updatedHotels });

      // Save to Firebase
      const tripRef = doc(db, 'trips', tripDocId);
      await updateDoc(tripRef, {
        hotels: updatedHotels
      });

      console.log('Vote saved to Firebase:', { hotelId, voteType });
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };

  const rateActivity = async (activityId, rating) => {
    if (!tripDocId) return;

    try {
      const updatedActivities = trip.activities.map(activity => {
        if (activity.id === activityId) {
          const newRatings = { ...activity.ratings };
          const newUserRatings = { ...activity.userRatings };
          
          // Remove previous rating if exists
          const previousRating = newUserRatings[user.id];
          if (previousRating) {
            newRatings[previousRating] = Math.max(0, newRatings[previousRating] - 1);
          }
          
          // Add new rating
          if (rating) {
            newRatings[rating] = (newRatings[rating] || 0) + 1;
            newUserRatings[user.id] = rating;
          } else {
            // Remove rating (change decision to null)
            delete newUserRatings[user.id];
          }
          
          // Calculate average rating
          const totalVotes = Object.values(newRatings).reduce((sum, count) => sum + count, 0);
          const weightedSum = Object.entries(newRatings).reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0);
          const averageRating = totalVotes > 0 ? weightedSum / totalVotes : 0;
          
          return { ...activity, ratings: newRatings, userRatings: newUserRatings, averageRating };
        }
        return activity;
      });

      // Update local state
      setTrip({ ...trip, activities: updatedActivities });

      // Save to Firebase
      const tripRef = doc(db, 'trips', tripDocId);
      await updateDoc(tripRef, {
        activities: updatedActivities
      });

      console.log('Rating saved to Firebase:', { activityId, rating });
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  };


  const addComment = async (type, itemId) => {
    const commentText = newComments[`${type}-${itemId}`];
    if (!commentText?.trim() || !tripDocId) return;

    try {
      const comment = {
        id: Date.now().toString(),
        text: commentText,
        author: user.name,
        createdAt: new Date(),
      };

      if (type === 'hotel') {
        const updatedHotels = trip.hotels.map(hotel => {
          if (hotel.id === itemId) {
            return { ...hotel, comments: [...hotel.comments, comment] };
          }
          return hotel;
        });
        
        // Update local state
        setTrip({ ...trip, hotels: updatedHotels });

        // Save to Firebase
        const tripRef = doc(db, 'trips', tripDocId);
        await updateDoc(tripRef, {
          hotels: updatedHotels
        });
      } else {
        const updatedActivities = trip.activities.map(activity => {
          if (activity.id === itemId) {
            return { ...activity, comments: [...activity.comments, comment] };
          }
          return activity;
        });
        
        // Update local state
        setTrip({ ...trip, activities: updatedActivities });

        // Save to Firebase
        const tripRef = doc(db, 'trips', tripDocId);
        await updateDoc(tripRef, {
          activities: updatedActivities
        });
      }

      // Clear the comment input
      setNewComments(prev => ({
        ...prev,
        [`${type}-${itemId}`]: ''
      }));

      console.log('Comment saved to Firebase:', comment);
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleCommentChange = (type, itemId, value) => {
    setNewComments(prev => ({
      ...prev,
      [`${type}-${itemId}`]: value
    }));
  };

  const toggleCommentsExpansion = (type, itemId) => {
    setExpandedComments(prev => ({
      ...prev,
      [`${type}-${itemId}`]: !prev[`${type}-${itemId}`]
    }));
  };

  // Sort hotels by popularity (awesome votes)
  const sortedHotels = trip?.hotels?.sort((a, b) => {
    const aScore = (a.votes?.awesome || 0) * 3 + (a.votes?.like || 0) * 2 - (a.votes?.dontLike || 0);
    const bScore = (b.votes?.awesome || 0) * 3 + (b.votes?.like || 0) * 2 - (b.votes?.dontLike || 0);
    return bScore - aScore;
  }) || [];

  const shareTrip = () => {
    const url = `${window.location.origin}/#/trip/${tripId}`;
    navigator.clipboard.writeText(url);
    alert('Trip URL copied to clipboard!');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!trip) {
    return (
      <Alert severity="error">
        Trip not found. Please check the URL and try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Trip Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FlightIcon sx={{ fontSize: 32, mr: 1, color: 'rgba(255, 255, 255, 0.9)' }} />
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 0 }}>
                  {trip.title}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                📍 {trip.destination}
              </Typography>
              {trip.description && (
                <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
                  {trip.description}
                </Typography>
              )}
              {trip.startDate && trip.endDate && (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </Typography>
              )}
              
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {user.name}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={shareTrip}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Share Trip
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<HotelIcon />} label="🏨 Hotels" />
            <Tab icon={<ActivityIcon />} label="🎯 Activities" />
          </Tabs>
        </Box>

        {/* Hotels Tab */}
        {activeTab === 0 && (
          <CardContent>
            {/* Add Hotel */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Add Hotel Option
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Hotel URL"
                  value={newHotelUrl}
                  onChange={(e) => setNewHotelUrl(e.target.value)}
                  placeholder="https://booking.com/hotel/..."
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addHotel}
                  disabled={!newHotelUrl.trim()}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Hotels List */}
            {sortedHotels.map((hotel, index) => (
              <Box key={hotel.id} sx={{ mb: 3, position: 'relative' }}>
                {index === 0 && sortedHotels.length > 1 && (
                  <Chip
                    label="Most Popular"
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                  />
                )}
                
                <HotelPreview
                  url={hotel.url}
                  votes={hotel.votes}
                  onVote={(voteType) => voteHotel(hotel.id, voteType)}
                  userVote={hotel.userVotes?.[user.id]}
                  userName={user.name}
                />

                {/* Comments Section */}
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CommentIcon fontSize="small" />
                        Comments ({hotel.comments.length})
                      </Typography>
                      {hotel.comments.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => toggleCommentsExpansion('hotel', hotel.id)}
                          sx={{ textTransform: 'none', minWidth: 'auto' }}
                        >
                          {expandedComments[`hotel-${hotel.id}`] ? 'Show Less' : 'Show All'}
                        </Button>
                      )}
                    </Box>
                    
                    {/* Existing Comments */}
                    {hotel.comments.length > 0 && (
                      <>
                        {/* Show latest comment always */}
                        {hotel.comments.slice(-1).map((comment) => (
                          <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                {comment.author.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {comment.author}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {comment.text}
                            </Typography>
                          </Box>
                        ))}
                        
                        {/* Show remaining comments if expanded */}
                        {expandedComments[`hotel-${hotel.id}`] && hotel.comments.length > 1 && (
                          <>
                            {hotel.comments.slice(0, -1).map((comment) => (
                              <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                    {comment.author.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {comment.author}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {comment.text}
                                </Typography>
                              </Box>
                            ))}
                          </>
                        )}
                      </>
                    )}

                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComments[`hotel-${hotel.id}`] || ''}
                        onChange={(e) => handleCommentChange('hotel', hotel.id, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <IconButton
                        color="primary"
                        onClick={() => addComment('hotel', hotel.id)}
                        disabled={!newComments[`hotel-${hotel.id}`]?.trim()}
                        sx={{ mb: 0.5 }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </CardContent>
        )}

        {/* Activities Tab */}
        {activeTab === 1 && (
          <CardContent>
            {/* Add Activity */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Add Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Activity Name"
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  placeholder="e.g., Visit Eiffel Tower"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={newActivityDescription}
                  onChange={(e) => setNewActivityDescription(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="Describe the activity..."
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addActivity}
                  disabled={!newActivityName.trim()}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Activity
                </Button>
              </Box>
            </Box>

            {/* Activities List */}
            {trip.activities.map((activity) => (
              <Card key={activity.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {activity.name}
                    </Typography>
                    {activity.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {activity.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Rating Section */}
                  <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Rate this activity:
                    </Typography>
                    
                    {activity.userRatings?.[user.id] ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Your rating:
                        </Typography>
                        <Chip
                          label={[
                            'Not interested', 'Maybe', 'Interested', 'Really want to do', 'Must do!'
                          ][activity.userRatings[user.id] - 1]}
                          color={[
                            'error', 'warning', 'info', 'primary', 'success'
                          ][activity.userRatings[user.id] - 1]}
                          variant="filled"
                        />
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => rateActivity(activity.id, null)}
                        >
                          Change decision
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                          Rate:
                        </Typography>
                        {[
                          { value: 1, label: 'Not interested', color: 'error' },
                          { value: 2, label: 'Maybe', color: 'warning' },
                          { value: 3, label: 'Interested', color: 'info' },
                          { value: 4, label: 'Really want to do', color: 'primary' },
                          { value: 5, label: 'Must do!', color: 'success' }
                        ].map(({ value, label, color }) => (
                          <Chip
                            key={value}
                            label={label}
                            color={color}
                            variant="outlined"
                            onClick={() => rateActivity(activity.id, value)}
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { 
                                bgcolor: `${color}.main`,
                                color: 'white'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {/* Rating Summary */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Object.entries(activity.ratings || {})
                        .filter(([rating, count]) => count > 0)
                        .map(([rating, count]) => (
                          <Chip
                            key={rating}
                            label={`${[
                              'Not interested', 'Maybe', 'Interested', 'Really want to do', 'Must do!'
                            ][parseInt(rating) - 1]} (${count})`}
                            size="small"
                            color={[
                              'error', 'warning', 'info', 'primary', 'success'
                            ][parseInt(rating) - 1]}
                            variant="outlined"
                          />
                        ))}
                    </Box>
                    
                    {Object.values(activity.ratings || {}).filter(count => count > 0).length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total votes: {Object.values(activity.ratings || {}).reduce((sum, count) => sum + count, 0)}
                        </Typography>
                      </Box>
                    )}
                  </Paper>

                  {/* Comments Section */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CommentIcon fontSize="small" />
                        Comments ({activity.comments.length})
                      </Typography>
                      {activity.comments.length > 1 && (
                        <Button
                          size="small"
                          onClick={() => toggleCommentsExpansion('activity', activity.id)}
                          sx={{ textTransform: 'none', minWidth: 'auto' }}
                        >
                          {expandedComments[`activity-${activity.id}`] ? 'Show Less' : 'Show All'}
                        </Button>
                      )}
                    </Box>
                    
                    {/* Existing Comments */}
                    {activity.comments.length > 0 && (
                      <>
                        {/* Show latest comment always */}
                        {activity.comments.slice(-1).map((comment) => (
                          <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                                {comment.author.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {comment.author}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {comment.text}
                            </Typography>
                          </Box>
                        ))}
                        
                        {/* Show remaining comments if expanded */}
                        {expandedComments[`activity-${activity.id}`] && activity.comments.length > 1 && (
                          <>
                            {activity.comments.slice(0, -1).map((comment) => (
                              <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                                    {comment.author.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {comment.author}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  {comment.text}
                                </Typography>
                              </Box>
                            ))}
                          </>
                        )}
                      </>
                    )}

                    {/* Add Comment Input */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComments[`activity-${activity.id}`] || ''}
                        onChange={(e) => handleCommentChange('activity', activity.id, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <IconButton
                        color="primary"
                        onClick={() => addComment('activity', activity.id)}
                        disabled={!newComments[`activity-${activity.id}`]?.trim()}
                        sx={{ mb: 0.5 }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

    </Box>
  );
};

export default TripPage;
