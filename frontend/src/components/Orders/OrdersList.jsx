import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, Eye, Edit, ShieldCheck, ShieldClose, Hash, Package, ShoppingCart, DollarSign, MapPin, Activity, Zap } from 'lucide-react';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/admin/getallorders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders 😵');
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };

  const getStatusDetails = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': 
        return { 
          class: 'status-completed', 
          icon: <Check color="white" size={16} />,
          emoji: '✅'
        };
      case 'pending': 
        return { 
          class: 'status-pending', 
          icon: <Clock color="black" size={16} />,
          emoji: '⏳'
        };
      case 'cancelled': 
        return { 
          class: 'status-cancelled', 
          icon: <X color="white" size={16} />,
          emoji: '❌'
        };
      case 'accepted': 
        return { 
          class: 'status-accepted', 
          icon: <ShieldCheck color="white" size={16} />,
          emoji: '✅'
        };
      case 'rejected': 
        return { 
          class: 'status-rejected', 
          icon: <ShieldClose color="white" size={16} />,
          emoji: '❌'
        };
      default: 
        return { 
          class: '', 
          icon: null,
          emoji: '❓'
        };
    }
  };

  const handleView = (orderId) => {
    alert(`Viewing details for Order #${orderId} 🔍`);
  };

  const handleEdit = (orderId) => {
    alert(`Editing Order #${orderId} ✏️`);
  };

  if (loading) return (
    <div className="loading">
      Loading orders... 🚚
    </div>
  );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-list-container">
      <h2 className="page-title">🛒 Order Management</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found 🤷‍♀️</p>
      ) : (
        <table className="order-table">
          <thead>
          <tr>
              <th><Hash size={16} /> Order ID</th>
              <th><Package size={16} /> Product</th>
              <th><ShoppingCart size={16} /> Quantity</th>
              <th><DollarSign size={16} /> Price</th>
              <th><DollarSign size={16} /> Total</th>
              <th><MapPin size={16} /> Pincode</th>
              <th><Activity size={16} /> Status</th>
              {/* <th><Zap size={16} /> Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusDetails = getStatusDetails(order.status);
              return (
                <tr key={order.ID} className="order-row">
                  <td>{order.ID}</td>
                  <td>{order.product_name}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.price}</td>
                  <td>₹{order.total_amount}</td>
                  <td>{order.pincode}</td>
                  <td>
                    <span 
                      className={`order-status ${statusDetails.class}`}
                    >
                      {statusDetails.icon} {statusDetails.emoji} {order.status}
                    </span>
                  </td>
                  {/* <td className="order-actions">
                    <button 
                      className="view-btn" 
                      onClick={() => handleView(order.ID)}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(order.ID)}
                    >
                      <Edit size={16} /> Edit
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;