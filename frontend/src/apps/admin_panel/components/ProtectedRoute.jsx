import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--secondary)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
          Verificando sesión...
        </p>
      </div>
    );
  }

  // Si no hay sesión, redirige al login
  if (!session) {
    return <Navigate to="/admin-acceso-seguro" replace />;
  }

  // Sesión activa → acceso directo al panel
  return <Outlet />;
};

export default ProtectedRoute;
