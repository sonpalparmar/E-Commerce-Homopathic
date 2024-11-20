import React, { useState } from 'react';
import { 
  FaShoppingCart, 
  FaBoxOpen, 
  FaUserCircle, 
  FaHome, 
  FaClipboardList 
} from 'react-icons/fa';
import ProductList from './buyer/ProductList';
import OrderList from './buyer/OrderList';

import './BuyerDashboard.css';

function BuyerDashboard() {
    const [activeSection, setActiveSection] = useState('products');
    const [cartCount] = useState(0);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-title">
                    <FaBoxOpen className="dashboard-title-icon" />
                    <h1>Product Marketplace 🛍️</h1>
                </div>
                <div className="dashboard-actions">
                    <button 
                        className={`action-button ${activeSection === 'cart' ? 'active' : ''}`}
                        onClick={() => setActiveSection('cart')}
                    >
                        <FaShoppingCart className="action-button-icon" /> 
                        Cart ({cartCount})
                    </button>
                    <button 
                        className="action-button"
                        onClick={() => alert('Profile section coming soon! 😊')}
                    >
                        <FaUserCircle className="action-button-icon" /> 
                        Profile
                    </button>
                </div>
            </header>
            <nav className="dashboard-nav">
                <button 
                    className={activeSection === 'products' ? 'active' : ''}
                    onClick={() => setActiveSection('products')}
                >
                    <FaHome /> Products
                </button>
                <button 
                    className={activeSection === 'orders' ? 'active' : ''}
                    onClick={() => setActiveSection('orders')}
                >
                    <FaClipboardList /> My Orders
                </button>
            </nav>
            <main className="fade-in">
                {activeSection === 'products' && <ProductList />}
                {activeSection === 'orders' && <OrderList />}
                {activeSection === 'cart' && (
                    <div className="cart-placeholder">
                        <h2>🛒 Your Cart</h2>
                        <p>Your cart is empty. Start shopping now! 🛍️</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default BuyerDashboard;


// import React, { useState } from 'react';
// import { 
//   FaShoppingCart, 
//   FaBoxOpen, 
//   FaUserCircle, 
//   FaHome, 
//   FaClipboardList 
// } from 'react-icons/fa';
// import ProductList from './buyer/ProductList';
// import OrderList from './buyer/OrderList';
// import './BuyerDashboard.css';

// function BuyerDashboard() {
//     const [activeSection, setActiveSection] = useState('products');
//     const [cartCount] = useState(0);

//     return (
//         <div className="dashboard-container">
//             <header className="dashboard-header">
//                 <div className="dashboard-title">
//                     <FaBoxOpen className="dashboard-title-icon" />
//                     <h1>Product Marketplace 🛍️</h1>
//                 </div>
//                 <div className="dashboard-actions">
//                     <button 
//                         className={`action-button ${activeSection === 'cart' ? 'active' : ''}`}
//                         onClick={() => setActiveSection('cart')}
//                     >
//                         <FaShoppingCart className="action-button-icon" /> 
//                         Cart ({cartCount})
//                     </button>
//                     <button 
//                         className="action-button"
//                         onClick={() => alert('Profile section coming soon! 😊')}
//                     >
//                         <FaUserCircle className="action-button-icon" /> 
//                         Profile
//                     </button>
//                 </div>
//             </header>
//             <nav className="dashboard-nav">
//                 <button 
//                     className={activeSection === 'products' ? 'active' : ''}
//                     onClick={() => setActiveSection('products')}
//                 >
//                     <FaHome /> Products
//                 </button>
//                 <button 
//                     className={activeSection === 'orders' ? 'active' : ''}
//                     onClick={() => setActiveSection('orders')}
//                 >
//                     <FaClipboardList /> My Orders
//                 </button>
//             </nav>
//             <main className="fade-in">
//                 {activeSection === 'products' && <ProductList />}
//                 {activeSection === 'orders' && <OrderList />}
//                 {activeSection === 'cart' && (
//                     <div className="cart-placeholder">
//                         <h2>🛒 Your Cart</h2>
//                         <p>Your cart is empty. Start shopping now! 🛍️</p>
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }

// export default BuyerDashboard;