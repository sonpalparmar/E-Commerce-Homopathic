import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';


const ProductCard = ({ product, onBuyClick }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src="/placeholder-image.jpg" 
          alt={product.name} 
          className="product-image" 
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="low-stock-badge">
            Only {product.stock} left!
          </span>
        )}
      </div>

      <h3 className="product-title">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      
      <div className="product-details">
        <p className="product-price">₹{product.price}</p>
        
        <div className="quantity-control">
          <button 
            onClick={handleDecrement} 
            disabled={quantity === 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button 
            onClick={handleIncrement} 
            disabled={quantity === product.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="product-footer">
        <span className="stock-info">Stock: {product.stock}</span>
        <button
          onClick={() => onBuyClick(product, quantity)}
          disabled={product.stock <= 0}
          className="buy-button"
        >
          {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => (
  <div className="order-card">
    <div className="order-header">
      <div>
        <h3>Order #{order.id}</h3>
        <p>Status: {order.status}</p>
      </div>
      <span className={`order-status ${order.status}`}>
        {order.status}
      </span>
    </div>
    <div className="order-details">
      <p>Quantity: {order.quantity}</p>
      <p>Total Amount: ₹{order.total_amount}</p>
      <p>Delivery Pincode: {order.pincode}</p>
    </div>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/products');
      setProducts(response.data.products);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders. Please try again later.');
      console.error('Error fetching orders:', err);
    }
  };

  const handleBuyClick = (product, quantity) => {
    setSelectedProduct(product);
    setOrderQuantity(quantity);
    setPincode('');
    setShowOrderModal(true);
  };

  const handleCreateOrder = async () => {
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
      fetchOrders();

      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    }
  };

  return (
    <div className="container">
      <div className="tab-navigation">
        <button 
          onClick={() => setActiveTab('products')}
          className={activeTab === 'products' ? 'active' : ''}
        >
          Products
        </button>
        <button 
          onClick={() => {
            setActiveTab('orders');
            fetchOrders();
          }}
          className={activeTab === 'orders' ? 'active' : ''}
        >
          My Orders
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {orderSuccess && (
        <div className="success-message">
          Order placed successfully!
        </div>
      )}

      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <>
          {activeTab === 'products' && (
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

          {activeTab === 'orders' && (
            <div className="orders-container">
              {orders.length === 0 ? (
                <p className="no-orders">No orders found</p>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          )}
        </>
      )}

      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)}>
        <h2>Place Order</h2>
        <div className="modal-form">
          <div className="form-group">
            <label>Quantity:</label>
            <div className="quantity-input">
              <button 
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
              >
                -
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
                +
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Delivery Pincode:</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter delivery pincode"
            />
          </div>

          {selectedProduct && (
            <div className="total-amount">
              <p>Total Amount: ₹{selectedProduct.price * orderQuantity}</p>
            </div>
          )}

          <div className="modal-actions">
            <button 
              className="cancel-button"
              onClick={() => setShowOrderModal(false)}
            >
              Cancel
            </button>
            <button 
              className="confirm-button"
              onClick={handleCreateOrder}
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