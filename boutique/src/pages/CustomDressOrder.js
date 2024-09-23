import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Box } from '@mui/material';

const CustomDressOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    if (location.state) {
      setSelectedFabric(location.state.selectedFabric);
      setSelectedColor(location.state.selectedColor);
      setSelectedStyle(location.state.selectedStyle);
    }
  }, [location.state]);

  const handleNavigate = (page) => navigate(page);

  const handleSubmit = () => alert("Order has been placed!");

  return (
    <Box
      sx={{
        padding: 4,
        fontFamily: "'Roboto', sans-serif",
        backgroundImage: `url(${require('../assets/bg1.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
        zIndex: 2,
      }}
    >
      <Box sx={{ zIndex: 3, maxWidth: '600px', width: '100%' }}>
        <Typography variant="h4" align="center" sx={{ color: '#fff', mb: 4 }}>
          Customize Your Dress
        </Typography>

        {selectedFabric && (
          <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa' }}>
            <Typography variant="h6">Fabric Selected: {selectedFabric.name}</Typography>
          </Card>
        )}

        {selectedColor && (
          <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa' }}>
            <Typography variant="h6">
              Color Selected: <span style={{ color: selectedColor }}>● {selectedColor}</span>
            </Typography>
          </Card>
        )}

        {selectedStyle && (
          <Card sx={{ padding: 2, mb: 2, backgroundColor: '#ffffffaa' }}>
            <Typography variant="h6">Dress Style Selected: {selectedStyle.name}</Typography>
          </Card>
        )}

        <Card sx={{ padding: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigate('/fabric-selection')}
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Fabric Selection
          </Button>
        </Card>

        <Card sx={{ padding: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigate('/color-selection')}
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Color Selection
          </Button>
        </Card>

        <Card sx={{ padding: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigate('/dress-style-selection')}
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Dress Style Selection
          </Button>
        </Card>

        <Card sx={{ padding: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigate('/measurements-input')}
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Measurements Input
          </Button>
        </Card>

        <Card sx={{ padding: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Place Order
          </Button>
        </Card>

        {/* Back Button */}
        <Card sx={{ padding: 2, mt: 2 }}>
          <Button
            variant="outlined"
            color="default"
            onClick={() => navigate(-1)} // Navigate to the previous page
            fullWidth
            sx={{ padding: '10px', fontSize: '14px' }}
          >
            Back
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default CustomDressOrder;
