import React from 'react';
import { LogOut, Package, Settings, User, Activity, DollarSign } from 'lucide-react';
import OrdersList from './seller/OrderList';
import './SellerDashboard.css';

function SellerDashboard() {
    const stats = [
        { icon: <Package size={24} />, emoji: "📦", label: "Total Orders", value: "156" },
        { icon: <DollarSign size={24} />, emoji: "💰", label: "Revenue", value: "₹45,690" },
        { icon: <Activity size={24} />, emoji: "📈", label: "Growth", value: "+12.5%" },
        { icon: <User size={24} />, emoji: "👥", label: "Customers", value: "89" }
    ];

    const handleLogout = () => {
        // Implement logout logic here
        console.log("Logging out...");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>🏪 Seller Dashboard</h1>
                    {/* <button className="logout-button" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span className="logout-text">Logout</span>
                    </button> */}
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">
                            {stat.icon}
                            <span className="stat-emoji">{stat.emoji}</span>
                        </div>
                        <div className="stat-info">
                            <h3>{stat.label}</h3>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                <OrdersList />
            </div>

            {/* <div className="quick-actions">
                <button className="action-button">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
                <button className="action-button">
                    <Package size={20} />
                    <span>Products</span>
                </button>
                <button className="action-button">
                    <User size={20} />
                    <span>Profile</span>
                </button>
            </div> */}
        </div>
    );
}

export default SellerDashboard;