import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

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

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/admin/products/${productId}`);
      setProducts(products.filter(product => product.ID !== productId));
      showSuccessMessage('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      await axios.put(
        `http://localhost:8080/api/v1/admin/products/${editingProduct.ID}`,
        payload
      );

      // Immediately update the local state with the new values
      const updatedProducts = products.map(product => {
        if (product.ID === editingProduct.ID) {
          return {
            ...product,
            ...payload,  // Use the payload we sent to ensure consistency
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      setIsEditModalOpen(false);
      showSuccessMessage('Product updated successfully');
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
      // Optionally refresh the products list if update failed
      // fetchProducts();
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const validatePriceInput = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleInputChange(e);
    }
  };

  const validateStockInput = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      handleInputChange(e);
    }
  };

  if (loading) return <div className="loading">Loading products... 📦</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">🏷️ Product Inventory</h2>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

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
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteProduct(product.ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={validatePriceInput}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock:</label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={validateStockInput}
                  placeholder="0"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;