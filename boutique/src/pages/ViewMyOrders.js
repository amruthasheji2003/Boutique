import React from 'react';

const ViewMyOrders = () => {
  // Simulating no orders for demonstration
  const orders = []; // Replace this with actual data fetching logic

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Orders</h1>
      {orders.length === 0 ? (
        <p style={styles.message}>No orders found.</p>
      ) : (
        <ul style={styles.orderList}>
          {orders.map((order) => (
            <li key={order.id} style={styles.orderItem}>
              {/* Display order details */}
              {order.product} - Quantity: {order.quantity} - Status: {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    fontSize: '1.2rem',
    color: '#888',
  },
  orderList: {
    listStyleType: 'none',
    padding: '0',
  },
  orderItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
};

export default ViewMyOrders;
