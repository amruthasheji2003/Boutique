// src/components/Payment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const Payment = ({ cartItems = [], totalAmount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Initialize items and total only if they haven't been set yet
    if (items.length === 0) {
      if (location.state?.buyNowItem) {
        const item = location.state.buyNowItem;
        if (item._id === 'cart' && item.items) {
          setItems(item.items);
          setTotal(item.price);
        } else {
          setItems([item]);
          setTotal(item.price * (item.quantity || 1));
        }
      } else if (cartItems.length > 0) {
        setItems(cartItems);
        setTotal(totalAmount);
      } else {
        navigate('/cart');
      }
    }
  }, [location, navigate, cartItems, totalAmount]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        script.remove();
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Please log in to continue');
      }

      // Validate shipping info
      const requiredFields = ['firstName', 'lastName', 'email', 'address', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !shippingInfo[field]);
      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }

      // Validate items
      if (!items?.length) {
        throw new Error('No items in cart');
      }

      // Format items data
      const formattedItems = items.map(item => ({
        _id: item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity || 1)
      }));

      // Calculate total
      const calculatedTotal = formattedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      // Create order in database
      const orderData = {
        userId,
        userEmail: shippingInfo.email,
        userName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address: shippingInfo.address,
        phoneNumber: shippingInfo.phoneNumber,
        items: formattedItems,
        totalPrice: calculatedTotal
      };

      console.log('Creating order with data:', orderData);

      // First create the order in your database
      let dbOrder;
      try {
        const orderResponse = await api.post('/payment/orders', orderData);
        console.log('Database order created:', orderResponse.data);
        dbOrder = orderResponse.data;
        
        if (!orderResponse.data.id) {
          throw new Error('Order ID not received from server');
        }
      } catch (error) {
        console.error('Error creating order in database:', error);
        throw new Error('Failed to create order in database: ' + (error.response?.data?.message || error.message));
      }

      // Then create Razorpay order
      let razorpayOrder;
      try {
        // Amount should be in paise (multiply by 100)
        const amountInPaise = Math.round(calculatedTotal * 100);
        console.log('Creating Razorpay order with amount:', amountInPaise);
        
        const razorpayResponse = await api.post('/payment/create-order', {
          amount: amountInPaise,
          orderId: dbOrder.id
        });

        console.log('Razorpay response:', razorpayResponse.data);
        
        if (!razorpayResponse.data.success || !razorpayResponse.data.order || !razorpayResponse.data.key_id) {
          console.error('Invalid Razorpay response:', razorpayResponse.data);
          throw new Error(razorpayResponse.data.error || 'Invalid response from payment service');
        }

        razorpayOrder = razorpayResponse.data;

        // Validate the key_id
        if (!razorpayOrder.key_id.startsWith('rzp_')) {
          console.error('Invalid Razorpay key format');
          throw new Error('Invalid payment configuration');
        }

      } catch (error) {
        console.error('Error creating Razorpay order:', error.response?.data || error);
        
        // Delete the database order if Razorpay order creation fails
        if (dbOrder?.id) {
          try {
            await api.patch(`/payment/orders/${dbOrder.id}`, {
              status: 'Failed',
              error: error.message
            });
          } catch (deleteError) {
            console.error('Error updating failed order:', deleteError);
          }
        }

        // Show appropriate error message
        if (error.response?.data?.error) {
          throw new Error(`Payment setup failed: ${error.response.data.error}`);
        } else if (error.response?.status === 401) {
          throw new Error('Payment service authentication failed. Please contact support.');
        } else {
          throw new Error(error.message || 'Failed to setup payment');
        }
      }

      // Load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      // Initialize Razorpay
      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        name: "Tailor's Touch Boutique",
        description: 'Payment for your order',
        order_id: razorpayOrder.order.id,
        notes: {
          address: shippingInfo.address,
          order_id: dbOrder.id
        },
        handler: async function(response) {
          try {
            console.log('Payment successful, verifying...', response);
            
            // Verify payment
            const verifyResponse = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: dbOrder.id
            });
            console.log('Payment verified:', verifyResponse.data);

            // Update order status
            await api.patch(`/payment/orders/${dbOrder.id}`, {
              status: 'Paid',
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id
            });

            // Store order details and redirect
            localStorage.setItem('lastOrder', JSON.stringify({
              orderId: response.razorpay_order_id,
              dbOrderId: dbOrder.id,
              amount: calculatedTotal
            }));

            navigate('/order-success');
          } catch (error) {
            console.error('Payment verification failed:', error.response?.data || error);
            setError('Payment verification failed: ' + (error.response?.data?.message || error.message));
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          escape: false,
          confirm_close: true
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phoneNumber
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || error.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handlePayment} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            required
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={shippingInfo.phoneNumber}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>{item.name} x {item.quantity || 1}</span>
                <span>₹{item.price * (item.quantity || 1)}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-bold">
              <span>Total: ₹{total}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default Payment;