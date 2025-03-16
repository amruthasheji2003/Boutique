import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Button, Divider, CircularProgress, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2)
}));

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get order details from localStorage
        const savedOrder = localStorage.getItem('lastOrder');
        if (!savedOrder) {
          throw new Error('No order details found');
        }

        const { dbOrderId } = JSON.parse(savedOrder);
        
        // Fetch complete order details from the server
        const response = await api.get(`/payment/orders/${dbOrderId}`);
        setOrderDetails(response.data);
        setLoading(false);
        
        // Clear the order from localStorage
        localStorage.removeItem('lastOrder');
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SuccessIcon />
            <Typography variant="h4" component="h1" gutterBottom>
              Order Successful!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              Thank you for your purchase. Your order has been confirmed.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {orderDetails && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Order ID:</strong> {orderDetails.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Order Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {orderDetails.status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Amount:</strong> ₹{orderDetails.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Shipping Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {orderDetails.userName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {orderDetails.userEmail}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {orderDetails.phoneNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {orderDetails.address}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {orderDetails.items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">
                        {item.name} x {item.quantity}
                      </Typography>
                      <Typography variant="body1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">₹{orderDetails.totalPrice.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/browse-catalog')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderSuccess; 