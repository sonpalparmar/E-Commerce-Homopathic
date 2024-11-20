import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaBoxOpen, 
  FaClipboardList, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaClock 
} from 'react-icons/fa';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/orders');
      setOrders(response.data);
    } catch (err) {
      setError('😱 Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': 
        return <FaCheckCircle className="status-icon completed" />;
      case 'pending': 
        return <FaClock className="status-icon pending" />;
      case 'cancelled': 
        return <FaTimesCircle className="status-icon cancelled" />;
      default: 
        return <FaTruck className="status-icon" />;
    }
  };

  const OrderCard = ({ order }) => (
    <div className="order-card pulse-hover">
      <div className="order-header">
        <div className="order-title">
          <h3>
            <FaBoxOpen className="title-icon" /> 
            Order #{order.id}
          </h3>
          <p>
            <FaClipboardList className="subtitle-icon" /> 
            Status: {order.status}
          </p>
        </div>
        <span className={`order-status ${order.status.toLowerCase()}`}>
          {getStatusIcon(order.status)}
          {order.status}
        </span>
      </div>
      <div className="order-details">
        <p>
          <span>Quantity:</span>
          <span>{order.quantity}</span>
        </p>
        <p>
          <span>Total Amount:</span>
          <span>₹{order.total_amount}</span>
        </p>
        <p>
          <span>Delivery Pincode:</span>
          <span>{order.pincode}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="container">
      {error && (
        <div className="error-message shake">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-indicator">
          Loading Orders... 🌀
        </div>
      ) : (
        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="no-orders">
              <FaBoxOpen className="empty-icon" />
              <p>No orders found 📦</p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;