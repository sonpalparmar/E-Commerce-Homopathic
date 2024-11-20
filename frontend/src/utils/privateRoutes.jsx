import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, role }) => {
    const { user } = useContext(AuthContext);

    if (!user || user.user_type !== role) {
        return <Navigate to="/login" />;
    }

    return <Component />;
};

export default PrivateRoute;
