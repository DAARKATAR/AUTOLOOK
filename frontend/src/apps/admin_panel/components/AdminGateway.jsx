import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import './AdminGateway.css';

const AdminGateway = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  async function verifyToken(token) {
    try {
      const response = await fetch(`${backendUrl}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin-jwt');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Token verification error:', err);
      sessionStorage.removeItem('admin-jwt');
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    // Verificar si ya tiene JWT válido en sessionStorage
    const storedJWT = sessionStorage.getItem('admin-jwt');
    if (storedJWT) {
      verifyToken(storedJWT);
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          token: adminToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error de autenticación');
        return;
      }

      // Almacenar JWT en sessionStorage (solo durante la sesión)
      sessionStorage.setItem('admin-jwt', data.token);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      setAdminToken('');
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de conexión. Verifica la URL del backend.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-gateway">
        <div className="gateway-container">
          <div className="gateway-card">
            <div className="gateway-header">
              <img src="/icon.png" alt="AutoLook" className="gateway-logo" />
              <h1>Panel Administrativo</h1>
              <p>Acceso Seguro Verificado por IP</p>
            </div>

            <div className="gateway-message">
              <p>
                🔐 Este panel está protegido por múltiples capas de seguridad:
              </p>
              <ul style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li>✅ Validación de IP whitelist en servidor</li>
                <li>✅ Autenticación con Supabase</li>
                <li>✅ Token JWT con IP binding</li>
                <li>✅ Políticas RLS en base de datos</li>
              </ul>
            </div>

            <form onSubmit={handleLoginSubmit} className="gateway-form">
              <div className="form-group">
                <label htmlFor="admin-token">Token de Seguridad</label>
                <input
                  id="admin-token"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Ingresa el token secreto..."
                  autoComplete="off"
                  required
                  disabled={loading}
                  className="token-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@autolook.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="token-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña segura..."
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="token-input"
                />
              </div>

              {error && (
                <div className="gateway-error" role="alert">
                  ❌ {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="gateway-btn">
                {loading ? '⏳ Verificando...' : '🔓 Verificar Acceso'}
              </button>
            </form>

            <button
              onClick={() => navigate('/')}
              className="gateway-back-btn"
            >
              ← Volver al sitio
            </button>

            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2rem', textAlign: 'center' }}>
              <p>Backend: {backendUrl}</p>
              <p>Tu sesión es protegida por IP. Si cambias de red, deberás autenticarte de nuevo.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminGateway;
