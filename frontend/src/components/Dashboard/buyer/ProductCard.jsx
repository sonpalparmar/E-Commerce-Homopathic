import React, { useState } from 'react';
import img from "../../../images/product_img.webp"
import { 
  FaTag, 
  FaTruck, 
  FaFire,
  FaShoppingCart, 
  FaPlus, 
  FaMinus 
} from 'react-icons/fa';
import './ProductCard.css';

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
    <div className="product-card pulse-hover">
      <div className="product-image-container">
        <img 
          src={img} 
          alt={product.name} 
          className="product-image" 
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="low-stock-badge vibrate">
            <FaFire /> Only {product.stock} left!
          </span>
        )}
      </div>

      <div className="product-details-container">
        <h3 className="product-title">
          <FaTag className="title-icon" /> {product.name}
        </h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-pricing">
          <p className="product-price">₹{product.price}</p>
          
          <div className="quantity-control">
            <button 
              onClick={handleDecrement} 
              disabled={quantity === 1}
              className="quantity-btn"
            >
              <FaMinus />
            </button>
            <span>{quantity}</span>
            <button 
              onClick={handleIncrement} 
              disabled={quantity === product.stock}
              className="quantity-btn"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        <div className="product-footer">
          <span className="stock-info">
            <FaTruck /> Stock: {product.stock}
          </span>
          <button
            onClick={() => onBuyClick(product, quantity)}
            disabled={product.stock <= 0}
            className="buy-button"
          >
            <FaShoppingCart /> 
            {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;