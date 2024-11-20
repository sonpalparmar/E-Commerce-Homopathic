import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import SellerDashboard from './components/Dashboard/SellerDashboard';
import BuyerDashboard from './components/Dashboard/BuyerDashboard';
import PrivateRoute from './utils/privateRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Redirect from root to login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<PrivateRoute component={AdminDashboard} role="admin" />} />
                    <Route path="/seller" element={<PrivateRoute component={SellerDashboard} role="seller" />} />
                    <Route path="/buyer" element={<PrivateRoute component={BuyerDashboard} role="buyer" />} />
                    {/* Catch all route for 404 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;