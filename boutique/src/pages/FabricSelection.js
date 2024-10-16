import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Grid, Box } from '@mui/material';

const FabricSelection = () => {
  const navigate = useNavigate();
  
  // Simulated fabric data (this can be fetched from your backend in a real scenario)
  const [fabrics, setFabrics] = useState([
    { id: 1, name: 'Cotton', color: 'White', imageUrl: '/path/to/cotton.jpg' },
    { id: 2, name: 'Silk', color: 'Red', imageUrl: '/path/to/silk.jpg' },
    { id: 3, name: 'Linen', color: 'Blue', imageUrl: '/path/to/linen.jpg' },
  ]);

  const handleFabricSelection = (fabric) => {
    navigate('/custom-dress-order', { state: { selectedFabric: fabric } });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={4} textAlign="center">Select Fabric</Typography>
      
      {/* Fabric List */}
      <Grid container spacing={4}>
        {fabrics.map((fabric) => (
          <Grid item xs={12} sm={6} md={4} key={fabric.id}>
            <Card sx={{ padding: 2, textAlign: 'center', boxShadow: 3 }}>
              <img src={fabric.imageUrl} alt={fabric.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <Typography variant="h6" sx={{ mt: 2 }}>{fabric.name}</Typography>
              <Typography variant="body1" color="textSecondary">Color: {fabric.color}</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2, backgroundColor: '#ff3e6c', '&:hover': { backgroundColor: '#ff6297' } }}
                onClick={() => handleFabricSelection(fabric)}
              >
                Select {fabric.name}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FabricSelection;
