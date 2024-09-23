import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Box } from '@mui/material';

const dressStyles = [
  { id: 1, name: 'Anarkali' },
  { id: 2, name: 'Frock' },
  { id: 3, name: 'Skirt Top' },
  { id: 4, name: 'Blouse' },
  { id: 5, name: 'Lehenga' },
  { id: 6, name: 'Shirt' },
  { id: 7, name: 'Pant' },
];

const DressStyleSelection = () => {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const navigate = useNavigate();

  const handleSelectStyle = (style) => {
    setSelectedStyle(style);
  };

  const handleProceed = () => {
    if (selectedStyle) {
      navigate('/custom-dress-order', {
        state: { selectedStyle },
      });
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        fontFamily: "'Roboto', sans-serif",
        backgroundImage: `url(${require('../assets/dressstyle.webp')})`,
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
          Select Your Dress Style
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, marginTop: 2 }}>
          {dressStyles.map((style) => (
            <Card
              key={style.id}
              onClick={() => handleSelectStyle(style)}
              sx={{
                padding: 2,
                cursor: 'pointer',
                backgroundColor: selectedStyle && selectedStyle.id === style.id ? '#e0f7fa' : '#fff',
                transition: 'background-color 0.3s ease',
              }}
            >
              <Typography variant="h6">{style.name}</Typography>
            </Card>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProceed}
          disabled={!selectedStyle}
          sx={{ marginTop: 2 }}
        >
          Proceed
        </Button>
      </Box>
    </Box>
  );
};

export default DressStyleSelection;
