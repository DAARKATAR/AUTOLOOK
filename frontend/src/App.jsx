import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import WhatsAppFloat from './shared/components/WhatsAppFloat';
import SharedCatalog from './shared/components/SharedCatalog';
import Landing from './pages/Landing';

// Lazy loading para rutas de administración
const Login = lazy(() => import('./apps/admin_panel/pages/Login'));
const AdminDashboard = lazy(() => import('./apps/admin_panel/pages/AdminDashboard'));
const ProtectedRoute = lazy(() => import('./apps/admin_panel/components/ProtectedRoute'));

function App() {
  return (
    <>
      <Suspense fallback={<div className="loading-state">Cargando...</div>}>
        <Routes>
          {/* --- PAGINA PRINCIPAL UNIFICADA --- */}
          <Route path="/" element={<Landing />} />
          
          {/* --- CATALOGO REDIRECT --- */}
          <Route path="/catalogo" element={<Landing />} />
          <Route path="/catalogo/:type" element={<Landing />} />

          {/* --- ADMIN CENTRALIZADO --- */}
          <Route path="/admin-acceso-seguro" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
      <WhatsAppFloat />
    </>
  );
}

export default App;
