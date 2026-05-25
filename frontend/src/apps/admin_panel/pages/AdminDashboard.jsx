import React, { useState, useEffect } from 'react';
import { catalogApi, authApi } from '../../../shared/services/api';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    storeType: 'motolook', // motolook, autolook, general
    category: 'Repuestos',
    brand: '', 
    price: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    // TEMPORIZADOR DE INACTIVIDAD (30 minutos = 1800000 ms)
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        alert('Sesión cerrada por inactividad.');
        handleLogout();
      }, 1800000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  // Fetching data with pagination/filtering from Backend
  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await catalogApi.getProducts(activeTab);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const editProduct = (prod) => {
    setFormData({
      id: prod.id,
      name: prod.name || '',
      storeType: prod.storeType || 'motolook',
      category: prod.category || 'Repuestos',
      brand: prod.brand || '',
      price: prod.price || '',
      stock: prod.stock || 0,
      imageUrl: prod.imageUrl || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', storeType: 'motolook', category: 'Repuestos', brand: '', price: '', stock: '', imageUrl: '' });
    setIsEditing(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar glass-dark">
        <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <img src="/icon.png" alt="AutoLook Logo" style={{ width: '70px', height: 'auto', borderRadius: '12px' }} />
          <h2 className="gradient-text" style={{ margin: 0, fontSize: '1.5rem' }}>AUTOLOOK</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><Package size={20} /> Inventario</button>

          <div style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <span style={{fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '1rem', marginBottom: '0.5rem'}}>
              🌐 Ver Tienda en Vivo
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item" style={{textDecoration: 'none', fontSize: '0.9rem'}}>
               💎 Ir a la Landing Page
            </a>
          </div>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout"><LogOut size={20} /> Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2>Gestión de Catálogo Premium</h2>
            <p className="text-dim">Maneja tu inventario aquí. Los cambios se reflejarán instantáneamente.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#00ffcc', textTransform: 'uppercase' }}>Total Mostrado</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{products.length}</span>
            </div>
            <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#0088ff', textTransform: 'uppercase' }}>En Stock (Unid.)</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{products.reduce((acc, curr) => acc + (curr.stock || 0), 0)}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-grid">
          <ProductForm 
            formData={formData} 
            setFormData={setFormData}
            isEditing={isEditing}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            resetForm={resetForm}
            fetchProducts={fetchProducts}
          />
          <ProductTable 
            products={products}
            loading={loading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            fetchProducts={fetchProducts}
            editProduct={editProduct}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
