import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  if (loading) return (
    <div className="loading">
      Loading products... 📦
    </div>
  );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">🏷️ Product Inventory</h2>
      {products.length === 0 ? (
        <p className="no-products">No products found 🤷‍♀️</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ID}>
                <td>{product.ID}</td>
                <td>{product.name}</td>
                <td>{product.description || 'No description'}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>{new Date(product.CreatedAt).toLocaleString()}</td>
                <td className="action-buttons">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;