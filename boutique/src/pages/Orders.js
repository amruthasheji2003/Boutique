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
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import axios from 'axios';
import { format, addDays } from 'date-fns';

// Row component for expandable order details
const Row = ({ order }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  // Calculate estimated delivery date (5-7 days from order date)
  const orderDate = new Date(order.createdAt);
  const minDeliveryDate = format(addDays(orderDate, 5), 'dd/MM/yyyy');
  const maxDeliveryDate = format(addDays(orderDate, 7), 'dd/MM/yyyy');

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Paid':
        return 'success';
      case 'Failed':
        return 'error';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

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
        <TableCell component="th" scope="row">
          {order._id}
        </TableCell>
        <TableCell>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</TableCell>
        <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
        <TableCell>
          <Chip 
            label={order.status} 
            color={getStatusColor(order.status)}
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
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shipping Information
                  </Typography>
                  <Typography>{order.userName}</Typography>
                  <Typography>{order.address}</Typography>
                  <Typography>{order.phoneNumber}</Typography>
                  <Typography>{order.userEmail}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Delivery Information
                  </Typography>
                  <Typography>
                    Estimated Delivery: {minDeliveryDate} - {maxDeliveryDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    * Delivery time may vary based on location and product availability
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                    Items
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell align="right">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>₹{order.totalPrice.toFixed(2)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
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
        const response = await axios.get('http://localhost:8080/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            You haven't placed any orders yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Estimated Delivery</TableCell>
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