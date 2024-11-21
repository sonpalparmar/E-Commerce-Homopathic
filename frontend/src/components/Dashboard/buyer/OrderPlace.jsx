import React, { useState } from 'react';
import axios from 'axios';
import { 
  FaShoppingCart, 
  FaMapMarkerAlt, 
  FaCheckCircle 
} from 'react-icons/fa';
import './OrderPlace.css';

const OrderPlace = ({ product, quantity, onOrderPlaced, onCancel }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePincode = (code) => {
    return /^\d{6}$/.test(code);
  };

  const handlePlaceOrder = async () => {
    if (!validatePincode(pincode)) {
      setError('Please enter a valid 6-digit pincode 📍');
      return;
    }

    console.log('Placing order with data:', {
      product,
      quantity,
      pincode
    });

    setLoading(true);
    setError('');

    try {
      const orderData = {
        product_id: product.ID,
        product_name: product.name,
        quantity: quantity,
        price: product.price,
        total_amount: product.price * quantity,
        pincode: pincode
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post('http://localhost:8080/api/v1/orders', orderData);
      
      console.log('Order response:', response.data);

      onOrderPlaced({
        message: `🎉 Order placed successfully for ${product.name}!`,
        orderDetails: response.data
      });
    } catch (err) {
      console.error('Error placing order:', err);
      
      if (err.response) {
        setError(`Order failed: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up the order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-place-modal">
      <div className="order-place-content">
        <h2>
          <FaShoppingCart className="order-icon" /> 
          Place Order
        </h2>
        
        <div className="order-summary">
          <p>
            <span>Product:</span>
            <span>{product.name}</span>
          </p>
          <p>
            <span>Quantity:</span>
            <span>{quantity}</span>
          </p>
          <p>
            <span>Price per unit:</span>
            <span>₹{product.price.toFixed(2)}</span>
          </p>
          <p>
            <span>Total Amount:</span>
            <span>₹{(product.price * quantity).toFixed(2)}</span>
          </p>
        </div>

        <div className="pincode-input">
          <label>
            <FaMapMarkerAlt className="pincode-icon" /> 
            Delivery Pincode
          </label>
          <input 
            type="text" 
            placeholder="Enter 6-digit pincode" 
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPincode(value);
              setError('');
            }}
            maxLength={6}
          />
        </div>

        {error && <div className="error-message shake">{error}</div>}

        <div className="order-actions">
          <button 
            className="cancel-button" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="confirm-button" 
            onClick={handlePlaceOrder}
            disabled={loading || !validatePincode(pincode)}
          >
            {loading ? 'Placing Order...' : (
              <>
                <FaCheckCircle /> Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPlace;