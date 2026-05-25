import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // If not authenticated, kick user back to login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes (Admin Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
