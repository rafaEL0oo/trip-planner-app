import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Button,
  CardMedia,
  Alert,
} from '@mui/material';
import { 
  Hotel as HotelIcon, 
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const HotelPreview = ({ url, votes, onVote, userVote, userName }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleGoToLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const fetchUrlMetadata = useCallback(async (urlToFetch) => {
    setLoading(true);
    setError('');
    
    try {
      // Ensure URL has protocol
      const fullUrl = urlToFetch.startsWith('http') ? urlToFetch : `https://${urlToFetch}`;
      
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const extractedMetadata = {
          title: data.data.title || 'Hotel Link',
          description: data.data.description || '',
          image: data.data.image?.url || '',
          url: data.data.url || fullUrl,
          site: data.data.publisher || data.data.site || '',
          author: data.data.author || '',
          publishedDate: data.data.publishedDate || '',
        };
        
        setPreview(extractedMetadata);
      } else {
        throw new Error(data.message || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError(err.message);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url && url.trim()) {
      fetchUrlMetadata(url);
    } else {
      setPreview(null);
      setError('');
    }
  }, [url, fetchUrlMetadata]);

  const getVoteIcon = (voteType) => {
    switch (voteType) {
      case 'dontLike': return <ThumbDownIcon />;
      case 'like': return <ThumbUpIcon />;
      case 'awesome': return <HeartIcon />;
      default: return null;
    }
  };

  const getVoteColor = (voteType) => {
    switch (voteType) {
      case 'dontLike': return 'error';
      case 'like': return 'primary';
      case 'awesome': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading hotel preview...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Failed to load preview: {error}
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HotelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Hotel Link ↗
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleGoToLink}
                  size="small"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Go to link
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyLink}
                  size="small"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Copy link
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Voting Section */}
          <Box sx={{ mt: 2 }} onClick={(e) => e.stopPropagation()}>
            {userVote ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your vote:
                </Typography>
                <Chip
                  icon={getVoteIcon(userVote)}
                  label={userVote === 'dontLike' ? "Don't Like" : userVote === 'like' ? 'Like' : 'Awesome'}
                  color={getVoteColor(userVote)}
                  variant="filled"
                />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => onVote(null)}
                >
                  Change decision
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                  Vote:
                </Typography>
                {[
                  { type: 'dontLike', label: "Don't Like", color: 'error', icon: <ThumbDownIcon /> },
                  { type: 'like', label: 'Like', color: 'primary', icon: <ThumbUpIcon /> },
                  { type: 'awesome', label: 'Awesome', color: 'secondary', icon: <HeartIcon /> }
                ].map(({ type, label, color, icon }) => (
                  <Chip
                    key={type}
                    icon={icon}
                    label={label}
                    color={color}
                    variant="outlined"
                    onClick={() => onVote(type)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )}
            
            {/* Vote Summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(votes || {})
                .filter(([voteType, count]) => count > 0)
                .map(([voteType, count]) => (
                <Chip
                  key={voteType}
                  icon={getVoteIcon(voteType)}
                  label={`${voteType === 'dontLike' ? "Don't Like" : voteType === 'like' ? 'Like' : 'Awesome'} (${count})`}
                  size="small"
                  color={getVoteColor(voteType)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // If no preview data, show simple URL display
  if (!preview) {
    return (
      <Card 
        sx={{ 
          mb: 2,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <HotelIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                Hotel Link ↗
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<OpenInNewIcon />}
                  onClick={handleGoToLink}
                  size="small"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Go to link
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyLink}
                  size="small"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Copy link
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Voting Section */}
          <Box sx={{ mt: 2 }} onClick={(e) => e.stopPropagation()}>
            {userVote ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your vote:
                </Typography>
                <Chip
                  icon={getVoteIcon(userVote)}
                  label={userVote === 'dontLike' ? "Don't Like" : userVote === 'like' ? 'Like' : 'Awesome'}
                  color={getVoteColor(userVote)}
                  variant="filled"
                />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => onVote(null)}
                >
                  Change decision
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                  Vote:
                </Typography>
                {[
                  { type: 'dontLike', label: "Don't Like", color: 'error', icon: <ThumbDownIcon /> },
                  { type: 'like', label: 'Like', color: 'primary', icon: <ThumbUpIcon /> },
                  { type: 'awesome', label: 'Awesome', color: 'secondary', icon: <HeartIcon /> }
                ].map(({ type, label, color, icon }) => (
                  <Chip
                    key={type}
                    icon={icon}
                    label={label}
                    color={color}
                    variant="outlined"
                    onClick={() => onVote(type)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )}
            
            {/* Vote Summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(votes || {})
                .filter(([voteType, count]) => count > 0)
                .map(([voteType, count]) => (
                <Chip
                  key={voteType}
                  icon={getVoteIcon(voteType)}
                  label={`${voteType === 'dontLike' ? "Don't Like" : voteType === 'like' ? 'Like' : 'Awesome'} (${count})`}
                  size="small"
                  color={getVoteColor(voteType)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        mb: 2, 
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <Box sx={{ display: 'flex', minHeight: 120 }}>
        {/* Hotel Image */}
        {preview?.image ? (
          <CardMedia
            component="img"
            image={preview.image}
            alt={preview.title}
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              position: 'relative',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <HotelIcon sx={{ fontSize: 40 }} />
          </Box>
        )}

        {/* Hotel Info */}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {preview?.title || 'Hotel Link'} ↗
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {preview?.description || 'Click to view hotel details'}
            </Typography>
            
            {/* Additional metadata */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {preview?.site && (
                <Chip
                  label={preview.site}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              {preview?.author && (
                <Chip
                  label={`by ${preview.author}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2, mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={handleGoToLink}
                size="small"
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Go to link
              </Button>
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={handleCopyLink}
                size="small"
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Copy link
              </Button>
            </Box>
          </Box>

          {/* Voting Section */}
          <Box onClick={(e) => e.stopPropagation()}>
            {userVote ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Your vote:
                </Typography>
                <Chip
                  icon={getVoteIcon(userVote)}
                  label={userVote === 'dontLike' ? "Don't Like" : userVote === 'like' ? 'Like' : 'Awesome'}
                  color={getVoteColor(userVote)}
                  variant="filled"
                />
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => onVote(null)}
                >
                  Change decision
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                  Vote:
                </Typography>
                {[
                  { type: 'dontLike', label: "Don't Like", color: 'error', icon: <ThumbDownIcon /> },
                  { type: 'like', label: 'Like', color: 'primary', icon: <ThumbUpIcon /> },
                  { type: 'awesome', label: 'Awesome', color: 'secondary', icon: <HeartIcon /> }
                ].map(({ type, label, color, icon }) => (
                  <Chip
                    key={type}
                    icon={icon}
                    label={label}
                    color={color}
                    variant="outlined"
                    onClick={() => onVote(type)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            )}
            
            {/* Vote Summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(votes || {})
                .filter(([voteType, count]) => count > 0)
                .map(([voteType, count]) => (
                <Chip
                  key={voteType}
                  icon={getVoteIcon(voteType)}
                  label={`${voteType === 'dontLike' ? "Don't Like" : voteType === 'like' ? 'Like' : 'Awesome'} (${count})`}
                  size="small"
                  color={getVoteColor(voteType)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default HotelPreview;
