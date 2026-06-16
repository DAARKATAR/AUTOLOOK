import React from 'react';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { catalogApi } from '../../../shared/services/api';

const ProductTable = ({ products, loading, activeTab, setActiveTab, fetchProducts, editProduct }) => {

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      await catalogApi.deleteProduct(id);
      fetchProducts();
    }
  };

  return (
    <div className="table-panel glass">
      <div className="table-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
          <h3>Inventario Actual</h3>
          <div className="admin-tabs" style={{display: 'none'}}>
            <button className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>Todas</button>
            <button className={`tab-btn ${activeTab === 'motolook' ? 'active' : ''}`} onClick={() => setActiveTab('motolook')}>MotoLook</button>
            <button className={`tab-btn ${activeTab === 'autolook' ? 'active' : ''}`} onClick={() => setActiveTab('autolook')}>AutoLook</button>
            <button className={`tab-btn ${activeTab === 'techlook' ? 'active' : ''}`} onClick={() => setActiveTab('techlook')}>TechLook</button>
          </div>
        </div>
        <button className="btn-icon action-btn refresh-btn" onClick={() => fetchProducts()} title="Actualizar inventario" style={{ color: 'var(--primary)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={20} />
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Img</th>
              <th>Producto</th>
              <th>Sucursal</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-4">Cargando inventario...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4">No hay productos en esta sucursal</td></tr>
            ) : (
              products.map(prod => (
                <tr key={prod.id}>
                  <td><img src={prod.imageUrl} alt={prod.name} className="table-img" /></td>
                  <td className="font-bold">
                    <div>{prod.name}</div>
                    <small style={{color: '#6B7A9A', fontSize: '0.8rem'}}>{prod.brand}</small>
                  </td>
                  <td>
                    <span className={`badge ${prod.storeType === 'autolook' ? 'badge-auto' : prod.storeType === 'motolook' ? 'badge-moto' : prod.storeType === 'techlook' ? 'badge-moto' : 'badge-general'}`}>
                      {prod.storeType === 'autolook' ? 'Carro' : prod.storeType === 'motolook' ? 'Moto' : prod.storeType === 'techlook' ? 'GPS/Tech' : 'Universal'}
                    </span>
                  </td>
                  <td><span className="badge">{prod.category}</span></td>
                  <td>
                    ${prod.price}
                    {prod.price_max ? ` - $${prod.price_max}` : ''}
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => editProduct(prod)} className="action-btn edit" title="Editar"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(prod.id)} className="action-btn delete" title="Eliminar"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
