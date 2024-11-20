import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
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
      setError('😱 Oops! Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    }
    setLoading(false);
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

      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      setError('🚫 Order failed. Please try again.');
      console.error('Error creating order:', err);
    }
  };

  const Modal = ({ children }) => {
    if (!showOrderModal) return null;

    return (
      <div className="modal-overlay modal-animation">
        <div className="modal-content slide-in">
          <button 
            className="modal-close" 
            onClick={() => setShowOrderModal(false)}
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
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter delivery pincode"
            />
          </div>

          {selectedProduct && (
            <div className="total-amount">
              <p>💰 Total Amount: ₹{selectedProduct.price * orderQuantity}</p>
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

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   FaShoppingCart, 
//   FaPlus, 
//   FaMinus, 
//   FaTag, 
//   FaTruck, 
//   FaFire 
// } from 'react-icons/fa';
// import './ProductList.css';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [orderQuantity, setOrderQuantity] = useState(1);
//   const [pincode, setPincode] = useState('');
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:8080/api/v1/products');
//       setProducts(response.data.products);
//     } catch (err) {
//       setError('😱 Oops! Failed to load products. Please try again later.');
//       console.error('Error fetching products:', err);
//     }
//     setLoading(false);
//   };

//   const handleBuyClick = (product, quantity) => {
//     setSelectedProduct(product);
//     setOrderQuantity(quantity);
//     setPincode('');
//     setShowOrderModal(true);
//   };

//   const handleCreateOrder = async () => {
//     try {
//       const orderData = {
//         product_id: selectedProduct.id,
//         product_name: selectedProduct.name,
//         quantity: parseInt(orderQuantity),
//         price: selectedProduct.price,
//         pincode: pincode,
//       };

//       await axios.post('http://localhost:8080/api/v1/orders', orderData);
//       setShowOrderModal(false);
//       setOrderSuccess(true);

//       setTimeout(() => setOrderSuccess(false), 3000);
//     } catch (err) {
//       setError('🚫 Order failed. Please try again.');
//       console.error('Error creating order:', err);
//     }
//   };

//   const ProductCard = ({ product }) => {
//     const [quantity, setQuantity] = useState(1);

//     const handleIncrement = () => {
//       if (quantity < product.stock) {
//         setQuantity(quantity + 1);
//       }
//     };

//     const handleDecrement = () => {
//       if (quantity > 1) {
//         setQuantity(quantity - 1);
//       }
//     };

//     return (
//       <div className="product-card pulse-hover">
//         <div className="product-image-container">
//           <img 
//             src="/placeholder-image.jpg" 
//             alt={product.name} 
//             className="product-image" 
//           />
//           {product.stock <= 5 && product.stock > 0 && (
//             <span className="low-stock-badge vibrate">
//               <FaFire /> Only {product.stock} left!
//             </span>
//           )}
//         </div>

//         <div className="product-details-container">
//           <h3 className="product-title">
//             <FaTag className="title-icon" /> {product.name}
//           </h3>
//           <p className="product-description">{product.description}</p>
          
//           <div className="product-pricing">
//             <p className="product-price">₹{product.price}</p>
            
//             <div className="quantity-control">
//               <button 
//                 onClick={handleDecrement} 
//                 disabled={quantity === 1}
//                 className="quantity-btn"
//               >
//                 <FaMinus />
//               </button>
//               <span>{quantity}</span>
//               <button 
//                 onClick={handleIncrement} 
//                 disabled={quantity === product.stock}
//                 className="quantity-btn"
//               >
//                 <FaPlus />
//               </button>
//             </div>
//           </div>

//           <div className="product-footer">
//             <span className="stock-info">
//               <FaTruck /> Stock: {product.stock}
//             </span>
//             <button
//               onClick={() => handleBuyClick(product, quantity)}
//               disabled={product.stock <= 0}
//               className="buy-button"
//             >
//               <FaShoppingCart /> 
//               {product.stock <= 0 ? 'Out of Stock' : 'Buy Now'}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const Modal = ({ children }) => {
//     if (!showOrderModal) return null;

//     return (
//       <div className="modal-overlay modal-animation">
//         <div className="modal-content slide-in">
//           <button 
//             className="modal-close" 
//             onClick={() => setShowOrderModal(false)}
//           >
//             ×
//           </button>
//           {children}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container">
//       {error && (
//         <div className="error-message shake">
//           {error}
//         </div>
//       )}

//       {orderSuccess && (
//         <div className="success-message bounce">
//           🎉 Order placed successfully! 🚀
//         </div>
//       )}

//       {loading ? (
//         <div className="loading-indicator">
//           Loading... 🌀
//         </div>
//       ) : (
//         <div className="product-grid">
//           {products.map((product) => (
//             <ProductCard
//               key={product.ID}
//               product={product}
//             />
//           ))}
//         </div>
//       )}

//       <Modal>
//         <h2>📦 Place Order</h2>
//         <div className="modal-form">
//           <div className="form-group">
//             <label>Quantity:</label>
//             <div className="quantity-input">
//               <button 
//                 onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
//               >
//                 <FaMinus />
//               </button>
//               <input
//                 type="number"
//                 value={orderQuantity}
//                 onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
//                 min="1"
//                 max={selectedProduct?.stock}
//               />
//               <button 
//                 onClick={() => setOrderQuantity(Math.min(selectedProduct?.stock, orderQuantity + 1))}
//               >
//                 <FaPlus />
//               </button>
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label>🏠 Delivery Pincode:</label>
//             <input
//               type="text"
//               value={pincode}
//               onChange={(e) => setPincode(e.target.value)}
//               placeholder="Enter delivery pincode"
//             />
//           </div>

//           {selectedProduct && (
//             <div className="total-amount">
//               <p>💰 Total Amount: ₹{selectedProduct.price * orderQuantity}</p>
//             </div>
//           )}

//           <div className="modal-actions">
//             <button 
//               className="cancel-button"
//               onClick={() => setShowOrderModal(false)}
//             >
//               Cancel
//             </button>
//             <button 
//               className="confirm-button"
//               onClick={handleCreateOrder}
//             >
//               Confirm Order
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ProductList;