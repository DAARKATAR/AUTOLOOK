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
    storeType: 'motolook',
    category: 'Repuestos',
    brand: '', 
    price: '',
    priceMax: '',
    imageUrl: ''
  });

  // Fetching data with pagination/filtering from Backend
  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await catalogApi.getProducts(activeTab);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    authApi.logout();
    navigate('/admin-acceso-seguro');
  }

  const editProduct = (prod) => {
    setFormData({
      id: prod.id,
      name: prod.name || '',
      storeType: prod.storeType || 'motolook',
      category: prod.category || 'Repuestos',
      brand: prod.brand || '',
      price: prod.price || '',
      priceMax: prod.price_max || '',
      imageUrl: prod.imageUrl || ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', storeType: 'motolook', category: 'Repuestos', brand: '', price: '', priceMax: '', imageUrl: '' });
    setIsEditing(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/icon.png" alt="AutoLook Logo" />
          <h2>AUTOLOOK</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><Package size={18} /> Inventario</button>
          <div className="nav-section-label">Tienda en Vivo</div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Landing Page
          </a>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout"><LogOut size={16} /> Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2>Gestión de Catálogo</h2>
            <p className="text-dim">Administra tu inventario. Los cambios se reflejan en tiempo real.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="stat-card">
              <span className="stat-label">Productos</span>
              <span className="stat-value">{products.length}</span>
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
