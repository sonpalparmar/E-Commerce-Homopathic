import React, { useState } from 'react';
import axios from 'axios';
import './ProductCreate.css';

const ProductCreate = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/v1/admin/products', {
        name: productData.name,
        description: productData.description, // Note: typo matches backend
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock)
      });

      setMessage('🎉 Product created successfully!');
      // Reset form
      setProductData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    } catch (err) {
      setError('❌ Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    }
  };

  return (
    <div className="product-create-container">
      <h2 className="page-title">🆕 Create New Product</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="product-create-form">
        <div className="form-group">
          <label>Product Name 📦</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description 📝</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Describe your product"
            required
          />
        </div>
        <div className="form-group">
          <label>Price ₹</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter price"
            required
          />
        </div>
        <div className="form-group">
          <label>Stock 🏷️</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            min="0"
            placeholder="Enter stock quantity"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Product 🚀
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;