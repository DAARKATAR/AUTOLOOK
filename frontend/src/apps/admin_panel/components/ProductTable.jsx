import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { catalogApi } from '../../../../shared/services/api';

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
          <div className="admin-tabs">
            <button className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`} onClick={() => setActiveTab('todos')}>Todas</button>
            <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>Universal</button>
            <button className={`tab-btn ${activeTab === 'motolook' ? 'active' : ''}`} onClick={() => setActiveTab('motolook')}>MotoLook</button>
            <button className={`tab-btn ${activeTab === 'autolook' ? 'active' : ''}`} onClick={() => setActiveTab('autolook')}>AutoLook</button>
          </div>
        </div>
        <button className="btn-icon" onClick={() => fetchProducts()}>🔄</button>
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
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-4">Cargando inventario...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-4">No hay productos en esta sucursal</td></tr>
            ) : (
              products.map(prod => (
                <tr key={prod.id}>
                  <td><img src={prod.imageUrl} alt={prod.name} className="table-img" /></td>
                  <td className="font-bold">
                    <div>{prod.name}</div>
                    <small style={{color: '#888'}}>{prod.brand}</small>
                  </td>
                  <td>
                    <span className={`badge ${prod.storeType === 'autolook' ? 'badge-auto' : prod.storeType === 'motolook' ? 'badge-moto' : 'badge-general'}`}>
                      {prod.storeType === 'autolook' ? 'Carro' : prod.storeType === 'motolook' ? 'Moto' : 'Universal'}
                    </span>
                  </td>
                  <td><span className="badge">{prod.category}</span></td>
                  <td>${prod.price}</td>
                  <td>
                    <span className={`stock-badge ${prod.stock < 5 ? 'low' : ''}`}>{prod.stock}</span>
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
