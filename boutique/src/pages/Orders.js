import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Grid,
  CircularProgress,
  useTheme,
  Divider,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import axios from 'axios';
import { format, addDays } from 'date-fns';

const API_URL = 'http://localhost:8080';

// Row component for expandable order details
const Row = ({ order }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [productImages, setProductImages] = useState({});

  // Function to get order status and tracking info
  const getOrderStatus = (order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    if (order.status === 'Cancelled') {
      return {
        status: 'Cancelled',
        color: 'error',
        message: 'Order has been cancelled'
      };
    }

    if (daysSinceOrder < 1) {
      return {
        status: 'Processing',
        color: 'info',
        message: 'Order is being processed'
      };
    } else if (daysSinceOrder < 3) {
      return {
        status: 'Confirmed',
        color: 'primary',
        message: 'Order confirmed and being packed'
      };
    } else if (daysSinceOrder < 5) {
      return {
        status: 'Shipped',
        color: 'warning',
        message: 'Your order is on the way'
      };
    } else {
      return {
        status: 'Delivered',
        color: 'success',
        message: 'Order has been delivered'
      };
    }
  };

  // Get current order status
  const orderStatus = getOrderStatus(order);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const imagePromises = order.items.map(async (item) => {
          const response = await axios.get(`${API_URL}/api/products/${item._id}`);
          return { id: item._id, image: response.data.image };
        });
        const images = await Promise.all(imagePromises);
        const imageMap = {};
        images.forEach(item => {
          imageMap[item.id] = item.image;
        });
        setProductImages(imageMap);
      } catch (err) {
        console.error('Error fetching product images:', err);
      }
    };

    if (open) {
      fetchProductImages();
    }
  }, [open, order.items]);

  // Calculate estimated delivery date (5-7 days from order date)
  const orderDate = new Date(order.createdAt);
  const minDeliveryDate = format(addDays(orderDate, 5), 'dd/MM/yyyy');
  const maxDeliveryDate = format(addDays(orderDate, 7), 'dd/MM/yyyy');

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {format(new Date(order.createdAt), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
        <TableCell>
          <Chip 
            label={orderStatus.status}
            color={orderStatus.color}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Box display="flex" alignItems="center">
            <LocalShippingIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            {minDeliveryDate} - {maxDeliveryDate}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              {/* Order Status Timeline */}
              <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Order Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: theme.palette[orderStatus.color].main,
                    mr: 1 
                  }} />
                  <Typography variant="body1">
                    {orderStatus.message}
                  </Typography>
                </Box>
              </Box>

              {/* Shipping Details */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Delivery Address
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {order.userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {order.phoneNumber}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Delivery Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        Expected Delivery: {minDeliveryDate} - {maxDeliveryDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        * Delivery time may vary based on your location
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Ordered Items */}
              <Typography variant="h6" gutterBottom color="primary">
                Items in Your Order
              </Typography>
              <Grid container spacing={2}>
                {order.items.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ display: 'flex', height: '100%' }}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: 140,
                          height: 140,
                          objectFit: 'cover',
                          borderRight: '1px solid #eee'
                        }}
                        image={productImages[item._id] ? `${API_URL}/${productImages[item._id]}` : 'https://placehold.co/140x140/png?text=No+Image'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/140x140/png?text=No+Image';
                        }}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ₹{item.price.toFixed(2)}
                        </Typography>
                        <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                          Total: ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Order Total: ₹{order.totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Orders data:', response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 3 }}>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell />
                <TableCell sx={{ color: 'white' }}>Order Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Total</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Expected Delivery</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <Row key={order._id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Orders; 