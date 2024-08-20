import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Button, Input, VStack } from '@chakra-ui/react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function MediaDetails({ updateMediaItem }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openaiKey, setOpenaiKey] = useState('');
  const [transcript, setTranscript] = useState('');
  const [mediaItem, setMediaItem] = useState(null);

  useEffect(() => {
    // Pause all videos when navigating to this page
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video) => video.pause());

    if (location.state && location.state.mediaItem) {
      const item = location.state.mediaItem;
      setMediaItem(item);
      if (item.video_transcript) {
        setTranscript(item.video_transcript);
      }
    } else {
      console.error('No media item found in location.state');
      navigate('/'); // Redirect to the grid page if no media item found
    }
  }, [location, navigate]);

  if (!mediaItem) {
    return <Text>Media not found or no longer available.</Text>;
  }

  const formatMediaUrl = (url) => {
    if (url.includes('?')) {
      return url.split('?')[0];
    }
    return url;
  };

  // const handleGenerateTranscript = async () => {
  //   const formattedUrl = formatMediaUrl(mediaItem.media_url);
  //   const payload = {
  //     openai_api_key: openaiKey,
  //     video_url: formattedUrl,
  //     mediaobject_id: mediaItem._id,
  //   };

  //   try {
  //     const response = await axios.post('http://127.0.0.1:5000/generate_transcript', payload);
  //     const updatedItem = response.data; // Assume this returns the updated mediaItem
  //     setTranscript(updatedItem.video_transcript);
  //     updateMediaItem(updatedItem); // Update mediaItems in the parent component
  //     setMediaItem(updatedItem); // Update the local mediaItem with the new transcript
  //   } catch (error) {
  //     console.error('Error generating transcript:', error);
  //     alert('Failed to generate transcript. Please try again.');
  //   }
  // };
  const handleGenerateTranscript = async () => {
    const formattedUrl = formatMediaUrl(mediaItem.media_url);
    const payload = {
      openai_api_key: openaiKey,
      video_url: formattedUrl,
      mediaobject_id: mediaItem._id,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_transcript', payload);
      
      if (response.data.error) {
        alert(response.data.error);  // Show an alert if there's an error
      } else {
        const updatedItem = response.data; // Assume this returns the updated mediaItem
        setTranscript(updatedItem.video_transcript);
        updateMediaItem(updatedItem); // Update mediaItems in the parent component
        setMediaItem(updatedItem); // Update the local mediaItem with the new transcript
      }
    } catch (error) {
      console.error('Error generating transcript:', error);
      alert('Failed to generate transcript. Please try again.');
    }
  };
  
  const renderMetadata = (label, value) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return (
      <Text>
        <strong>{label}:</strong> {Array.isArray(value) ? value.join(', ') : value}
      </Text>
    );
  };

  return (
    <VStack spacing={4} align="start" p={4}>
      <Button onClick={() => navigate(-1)} mb={4}>Back to Grid</Button>
      <Box width="100%">
        {mediaItem.media_type === 'image' ? (
          <Image src={mediaItem.media_url} alt="media" />
        ) : (
          <video controls style={{ width: '100%' }}>
            <source src={mediaItem.media_url} type="video/mp4" />
          </video>
        )}
      </Box>
      <Box>
        {renderMetadata('Brand Base URL', mediaItem.brand_base_url)}
        {renderMetadata('Source URL', mediaItem.source_url)}
        {renderMetadata('Source Page Type', mediaItem.source_page_type)}
        {renderMetadata('Media Type', mediaItem.media_type)}
        {renderMetadata('Media URL', mediaItem.media_url)}
        {renderMetadata('Aspect Ratio', mediaItem.aspect_ratio)}
        {renderMetadata('File Size', mediaItem.file_size)}
        {renderMetadata('Dimensions', `${mediaItem.width}x${mediaItem.height}`)}
        {renderMetadata('Has Product', mediaItem.has_product ? 'Yes' : 'No')}
        {renderMetadata('Has Human', mediaItem.has_human ? 'Yes' : 'No')}
        {renderMetadata('Has Multiple Products', mediaItem.has_multiple_products ? 'Yes' : 'No')}
        {renderMetadata('Product Tag', mediaItem.product_tag)}
        {renderMetadata('Collection Tag', mediaItem.collection_tag)}
        {renderMetadata('Product Tags (Main Node A Tags)', mediaItem.product_tags_main_node_a_tags)}
        {renderMetadata('Collection Tags (Main Node A Tags)', mediaItem.collection_tags_main_node_a_tags)}
        {renderMetadata('Product Tags (Main Node Text)', mediaItem.product_tags_main_node_text)}
        {renderMetadata('Product Tags (XPath A Tags)', mediaItem.product_tags_xpath_a_tags)}
        {renderMetadata('Collection Tags (XPath A Tags)', mediaItem.collections_tags_xpath_a_tags)}
        {renderMetadata('Product Tags (XPath Text)', mediaItem.product_tags_xpath_text)}
      </Box>
      {mediaItem.media_type === 'video' && (
        <Box>
          <Input
            placeholder="Enter OpenAI API Key"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
          />
          <Button onClick={handleGenerateTranscript} mt={2}>Generate Transcript</Button>
          {transcript && (
            <Box mt={4}>
              <Text><strong>Transcript:</strong></Text>
              <Text whiteSpace="pre-wrap">{transcript}</Text>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
}

export default MediaDetails;
