
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'client'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the main landing page
    return <Navigate to="/" replace />;
  }

  if (!userType || !allowedRoles.includes(userType)) {
    // If authenticated user tries to access a route they don't have permission for,
    // redirect them to their respective dashboard.
    if (userType === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    if (userType === 'client') {
        return <Navigate to="/client/dashboard" replace />;
    }
    // Fallback redirect to landing if userType is somehow invalid
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
