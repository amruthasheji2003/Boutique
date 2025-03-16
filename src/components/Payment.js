const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};

const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      console.log('User ID from localStorage:', userId);

      if (!userId) {
        throw new Error('Please log in to continue');
      }

      // Validate inputs
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
          !shippingInfo.address || !shippingInfo.phoneNumber) {
        throw new Error('Please fill in all required fields');
      }

      // Validate items
      if (!items || items.length === 0) {
        throw new Error('No items in cart');
      }

      // Format items data for boutique products
      const formattedItems = items.map(item => {
        const itemData = item.productId || item; // Handle both cart items and direct purchases
        if (!itemData._id || !itemData.name || !itemData.price) {
          console.error('Invalid item data:', itemData);
          throw new Error('Invalid item data');
        }
        return {
          _id: itemData._id,
          name: itemData.name,
          price: parseFloat(itemData.price),
          quantity: parseInt(item.quantity || 1)
        };
      });

      // Calculate total price to ensure it matches
      const calculatedTotal = formattedItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      if (Math.abs(calculatedTotal - total) > 0.01) {
        console.error('Price mismatch:', { calculated: calculatedTotal, received: total });
        throw new Error('Total price mismatch');
      }

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

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const orderResponse = await axios.post('http://localhost:8080/api/payment/orders', orderData);

      console.log('Order creation response:', orderResponse.data);

      if (!orderResponse.data || !orderResponse.data.id) {
        throw new Error('Failed to create order in database');
      }

      const orderId = orderResponse.data.id;

      // Create Razorpay order
      const razorpayData = {
        amount: Math.round(calculatedTotal * 100), // Convert to paise
        currency: 'INR',
      };

      console.log('Creating Razorpay order with data:', razorpayData);

      const response = await axios.post('http://localhost:8080/api/payment/create-order', razorpayData);

      console.log('Razorpay order response:', response.data);

      if (!response.data || !response.data.id) {
        throw new Error('Failed to create Razorpay order');
      }

      // Load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_VnpNv6gkEvVCsq',
        amount: response.data.amount,
        currency: response.data.currency,
        name: "Tailor's Touch Boutique",
        description: 'Fashion & Apparel Purchase',
        order_id: response.data.id,
        handler: async function (response) {
          try {
            console.log('Payment successful, updating order:', response);
            // Update order status
            await axios.patch(`http://localhost:8080/api/payment/orders/${orderId}`, {
              status: 'Paid',
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });

            // Clear cart if this was a cart purchase
            if (cartItems.length > 0) {
              await clearCart();
            }

            // Store order details
            localStorage.setItem('lastOrder', JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: calculatedTotal,
              date: new Date().toISOString()
            }));

            // Show success message and navigate
            alert('Payment successful! Thank you for shopping with us.');
            navigate('/order-success');
          } catch (error) {
            console.error('Error updating order:', error);
            setError('Payment successful but failed to update order status');
          }
        },
        prefill: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          contact: shippingInfo.phoneNumber
        },
        theme: {
          color: '#FF1493' // Pink theme for boutique
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      console.log('Opening Razorpay with options:', { ...options, key: '***hidden***' });

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || error.message);
      } else {
        console.error('Error details:', error);
        setError(error.message || 'Failed to process payment');
      }
      setLoading(false);
    }
};

return (
  <div className="max-w-2xl mx-auto p-6">
    <h2 className="text-2xl font-bold mb-6">Secure Checkout</h2>
    
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
        <textarea
          name="address"
          value={shippingInfo.address}
          onChange={handleInputChange}
          required
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => {
            const itemData = item.productId || item;
            return (
              <div key={itemData._id} className="flex justify-between">
                <span>{itemData.name} x {item.quantity || 1}</span>
                <span>₹{itemData.price * (item.quantity || 1)}</span>
              </div>
            );
          })}
          <div className="border-t pt-2 font-bold">
            <span>Total Amount: ₹{total}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  </div>
); 