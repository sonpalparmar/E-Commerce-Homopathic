import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('');
  const [isModalClosing, setIsModalClosing] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/products');
      setProducts(response.data.products);
    } catch (err) {
      setError('😱 Oops! Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const validatePincode = (code) => {
    // Indian pincode validation: 6 digits
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(code);
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(value);
    
    if (value.length === 6) {
      if (validatePincode(value)) {
        setPincodeError('');
      } else {
        setPincodeError('Invalid pincode format');
      }
    } else if (value.length > 0) {
      setPincodeError('Pincode must be 6 digits');
    } else {
      setPincodeError('');
    }
  };

  const handleBuyClick = (product, quantity) => {
    setSelectedProduct(product);
    setOrderQuantity(quantity);
    setPincode('');
    setPincodeError('');
    setModalAnimation('slide-in');
    setShowOrderModal(true);
  };

  const handleCreateOrder = async () => {
    if (!validatePincode(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return;
    }

    try {
      const orderData = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity: parseInt(orderQuantity),
        price: selectedProduct.price,
        pincode: pincode,
      };

      await axios.post('http://localhost:8080/api/v1/orders', orderData);
      setShowOrderModal(false);
      setOrderSuccess(true);
      setModalAnimation('');

      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      setError('🚫 Order failed. Please try again.');
      console.error('Error creating order:', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowOrderModal(false);
      setIsModalClosing(false);
    }, 300);
  };

  const Modal = ({ children }) => {
    if (!showOrderModal) return null;

    return (
      <div 
        className={`modal-overlay ${isModalClosing ? 'fade-out' : ''}`}
        onClick={handleCloseModal}
      >
        <div 
          className={`modal-content ${isModalClosing ? 'fade-out' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="modal-close" 
            onClick={handleCloseModal}
          >
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {error && (
        <div className="error-message shake">
          {error}
        </div>
      )}

      {orderSuccess && (
        <div className="success-message bounce">
          🎉 Order placed successfully! 🚀
        </div>
      )}

      {loading ? (
        <div className="loading-indicator">
          Loading... 🌀
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.ID}
              product={product}
              onBuyClick={handleBuyClick}
            />
          ))}
        </div>
      )}

      <Modal>
        <h2>📦 Place Order</h2>
        <div className="modal-form">
          <div className="form-group">
            <label>Quantity:</label>
            <div className="quantity-input">
              <button 
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                min="1"
                max={selectedProduct?.stock}
              />
              <button 
                onClick={() => setOrderQuantity(Math.min(selectedProduct?.stock, orderQuantity + 1))}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>🏠 Delivery Pincode:</label>
            <div className="pincode-input-container">
              <input
                type="text"
                value={pincode}
                onChange={handlePincodeChange}
                placeholder="Enter delivery pincode"
                maxLength="6"
              />
              {pincode && (
                pincodeError ? (
                  <FaTimesCircle className="pincode-validation-icon error" />
                ) : (
                  <FaCheckCircle className="pincode-validation-icon success" />
                )
              )}
            </div>
            {pincodeError && (
              <p className="pincode-error">{pincodeError}</p>
            )}
          </div>

          {selectedProduct && (
            <div className="total-amount">
              <p>💰 Total Amount: ₹{selectedProduct.price * orderQuantity}</p>
            </div>
          )}

          <div className="modal-actions">
            <button 
              className="cancel-button"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button 
              className="confirm-button"
              onClick={handleCreateOrder}
              disabled={!validatePincode(pincode)}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;