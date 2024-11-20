import React, { useState } from 'react';
import './AdminDashboard.css';
import ProductList from './admin/ProductList';
import ProductCreate from '../Products/ProductCreate';
import OrderList from '../Orders/OrdersList';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products');

    const renderContent = () => {
        switch(activeTab) {
            case 'products':
                return <ProductList />;
            case 'create-product':
                return <ProductCreate />;
            case 'orders':
                return <OrderList />;
            default:
                return <ProductList />;
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">🛍️ Admin Dashboard 🔧</h1>
            <div className="admin-tabs">
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                >
                    Product List
                </button>
                <button 
                    onClick={() => setActiveTab('create-product')}
                    className={`tab-button ${activeTab === 'create-product' ? 'active' : ''}`}
                >
                    Create Product
                </button>
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                >
                    Order List
                </button>
            </div>
            
            {renderContent()}
        </div>
    );
}

export default AdminDashboard;