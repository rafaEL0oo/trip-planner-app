import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Link,
} from '@mui/material';
import { OpenInNew as OpenIcon, Link as LinkIcon } from '@mui/icons-material';

const UrlPreview = ({ url, onMetadataChange }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (url && url.trim()) {
      fetchUrlMetadata(url);
    } else {
      setMetadata(null);
      setError('');
    }
  }, [url]);

  const fetchUrlMetadata = async (urlToFetch) => {
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
          title: data.data.title || 'Untitled',
          description: data.data.description || '',
          image: data.data.image?.url || '',
          url: data.data.url || fullUrl,
          site: data.data.publisher || data.data.site || '',
          author: data.data.author || '',
          publishedDate: data.data.publishedDate || '',
        };
        
        setMetadata(extractedMetadata);
        onMetadataChange && onMetadataChange(extractedMetadata);
      } else {
        throw new Error(data.message || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError(err.message);
      setMetadata(null);
      onMetadataChange && onMetadataChange(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Fetching URL preview...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Failed to load preview: {error}
        </Typography>
      </Alert>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <Card sx={{ mb: 2, maxWidth: 600 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
        {metadata.image && (
          <CardMedia
            component="img"
            image={metadata.image}
            alt={metadata.title}
            sx={{
              width: { xs: '100%', sm: 200 },
              height: { xs: 200, sm: 150 },
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              flex: 1,
              mr: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {metadata.title}
            </Typography>
            <Link
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 1, color: 'text.secondary' }}
            >
              <OpenIcon fontSize="small" />
            </Link>
          </Box>
          
          {metadata.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {metadata.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {metadata.site && (
              <Chip
                icon={<LinkIcon />}
                label={metadata.site}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
            {metadata.author && (
              <Chip
                label={`by ${metadata.author}`}
                size="small"
                variant="outlined"
                color="secondary"
              />
            )}
            {metadata.publishedDate && (
              <Chip
                label={new Date(metadata.publishedDate).toLocaleDateString()}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default UrlPreview;
