import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaShoppingCart, 
  FaBoxOpen, 
  FaTag, 
  FaPlus, 
  FaMinus 
} from 'react-icons/fa';
import OrderPlace from './OrderPlace';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cart, setCart] = useState({});
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/products');
      
      // Log the entire response for debugging
      console.log('Full API Response:', response.data);

      // Ensure we're handling the correct data structure
      const productsList = response.data?.products || [];
      
      // Additional logging
      console.log('Parsed Products:', productsList);
      
      setProducts(productsList);
    } catch (err) {
      setError('😱 Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    if (!product || !product.ID) {
      console.error('Invalid product:', product);
      return;
    }

    console.log('Current cart:', cart);
    console.log('Product being added:', product);

    setCart(prevCart => {
      const currentQuantity = prevCart[product.ID] || 0;
      
      if (currentQuantity + 1 > product.stock) {
        console.warn(`Cannot add more than available stock (${product.stock})`);
        return prevCart;
      }

      return {
        ...prevCart,
        [product.ID]: currentQuantity + 1
      };
    });
  };

  const handleRemoveFromCart = (product) => {
    setCart(prevCart => {
      const currentQuantity = prevCart[product.ID] || 0;
      if (currentQuantity > 1) {
        return {
          ...prevCart,
          [product.ID]: currentQuantity - 1
        };
      }
      const { [product.ID]: removed, ...remainingCart } = prevCart;
      return remainingCart;
    });
  };

  const handleOrderModalOpen = (product) => {
    setSelectedProductForOrder(product);
  };

  const handleOrderModalClose = () => {
    setSelectedProductForOrder(null);
  };

  const handleOrderPlaced = (orderResult) => {
    alert(orderResult.message);
    
    setCart(prevCart => {
      const { [selectedProductForOrder.ID]: removed, ...remainingCart } = prevCart;
      return remainingCart;
    });

    setSelectedProductForOrder(null);
  };

  const ProductCard = ({ product }) => {
    const cartQuantity = cart[product.ID] || 0;

    return (
      <div className="product-card pulse-hover">
        <div className="product-header">
          <h3>
            <FaBoxOpen className="title-icon" /> 
            {product.name}
          </h3>
          <span className="product-price">
            <FaTag className="price-icon" /> 
            ₹{product.price.toFixed(2)}
          </span>
        </div>
        <div className="product-details">
          <p>{product.description}</p>
          <p>
            <span>Stock:</span>
            <span>{product.stock} units</span>
          </p>
        </div>
        <div className="product-actions">
          <div className="cart-control">
            <button 
              onClick={() => handleRemoveFromCart(product)}
              disabled={cartQuantity === 0}
            >
              <FaMinus />
            </button>
            <span>{cartQuantity}</span>
            <button 
              onClick={() => handleAddToCart(product)}
              disabled={cartQuantity >= product.stock}
            >
              <FaPlus />
            </button>
          </div>
          <button 
            className="order-button"
            onClick={() => handleOrderModalOpen(product)}
            disabled={cartQuantity === 0}
          >
            <FaShoppingCart /> Place Order
          </button>
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

      {loading ? (
        <div className="loading-indicator">
          Loading Products... 🌀
        </div>
      ) : (
        <div className="products-container">
          {products.length === 0 ? (
            <div className="no-products">
              <FaBoxOpen className="empty-icon" />
              <p>No products available 🛍️</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.ID} product={product} />
            ))
          )}
        </div>
      )}

      {selectedProductForOrder && (
        <OrderPlace 
          product={selectedProductForOrder}
          quantity={cart[selectedProductForOrder.ID] || 1}
          onOrderPlaced={handleOrderPlaced}
          onCancel={handleOrderModalClose}
        />
      )}
    </div>
  );
};

export default ProductList;