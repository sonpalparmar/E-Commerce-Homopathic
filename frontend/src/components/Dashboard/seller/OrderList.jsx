import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderList.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/seller/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderResponse = async (orderId, action) => {
    try {
      // Check if rejecting without a reason
      if (action === 'reject' && (!rejectReason[orderId] || rejectReason[orderId].trim() === '')) {
        alert('Please provide a reject reason before rejecting the order.');
        return;
      }

      const payload = {
        Accept: action === 'accept',  // Changed to capital 'Accept'
        RejectReason: action === 'reject' ? rejectReason[orderId] : ''  // Changed to capital 'RejectReason'
      };

      await axios.post(`http://localhost:8080/api/v1/seller/orders/${orderId}/respond`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setOrders(orders.map(order => 
        order.ID === orderId 
          ? { 
              ...order, 
              status: action === 'accept' ? 'accepted' : 'rejected',
              reject_reason: action === 'reject' ? payload.RejectReason : ''
            } 
          : order
      ));

      // Clear the reject reason after successful rejection
      if (action === 'reject') {
        setRejectReason(prev => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      }
    } catch (err) {
      alert(`Failed to ${action} order: ${err.response?.data?.error || 'Unknown error'}`);
      console.error(err);
    }
  };

  const handleRejectReasonChange = (orderId, reason) => {
    setRejectReason(prev => ({
      ...prev,
      [orderId]: reason
    }));
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">🛍️ My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found 📦</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.ID} className="order-card">
              <div className="order-header">
                <span className="order-number">Order #{order.ID}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              
              <div className="order-details">
                <div className="order-detail">
                  <span className="detail-label">Product:</span>
                  <span>{order.product_name}</span>
                </div>
                <div className="order-detail">
                  <span className="detail-label">User ID:</span>
                  <span>{order.user_id}</span>
                </div>
                <div className="order-detail">
                  <span className="detail-label">Pincode:</span>
                  <span>{order.pincode}</span>
                </div>
                <div className="order-detail">
                  <span className="detail-label">Total:</span>
                  <span>₹{order.total_amount}</span>
                </div>
                <div className="order-detail">
                  <span className="detail-label">Quantity:</span>
                  <span>{order.quantity}</span>
                </div>
                {order.reject_reason === '' ? <></> : 
                <div className="order-detail">
                  <span className="detail-label">Reason:</span>
                  <span>{order.reject_reason}</span>
                </div>
                }
              </div>
              
              {order.status === 'pending' && (
                <>
                  <div className="order-actions">
                    <button 
                      onClick={() => handleOrderResponse(order.ID, 'accept')}
                      className="action-button accept"
                    >
                      ✅ Accept
                    </button>
                    <button 
                      onClick={() => handleOrderResponse(order.ID, 'reject')}
                      className="action-button reject"
                    >
                      ❌ Reject
                    </button>
                  </div>
                  <input 
                    type="text"
                    placeholder="Reject reason (required)"
                    className="reject-reason-input"
                    value={rejectReason[order.ID] || ''}
                    onChange={(e) => handleRejectReasonChange(order.ID, e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;