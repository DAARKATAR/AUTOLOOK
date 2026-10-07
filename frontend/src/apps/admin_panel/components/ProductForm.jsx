import React from 'react';
import { Car, Bike, Radio, Check } from 'lucide-react';
import { catalogApi } from '../../../shared/services/api';

const ProductForm = ({ formData, setFormData, isEditing, isUploading, setIsUploading, resetForm, fetchProducts }) => {

  const getSelectedCatalogs = (val) => {
    if (!val) return ['autolook'];
    if (Array.isArray(val)) return val;
    if (val === 'general') return ['autolook', 'motolook', 'techlook'];
    const parts = val.split(',').map(s => s.trim().toLowerCase());
    const valid = parts.filter(s => s === 'autolook' || s === 'motolook' || s === 'techlook');
    return valid.length > 0 ? valid : ['autolook'];
  };

  const selectedCatalogs = getSelectedCatalogs(formData.storeType);

  const toggleCatalog = (catalogKey) => {
    let next;
    if (selectedCatalogs.includes(catalogKey)) {
      if (selectedCatalogs.length === 1) {
        alert('El producto debe pertenecer al menos a un catálogo.');
        return;
      }
      next = selectedCatalogs.filter(c => c !== catalogKey);
    } else {
      next = [...selectedCatalogs, catalogKey];
    }
    setFormData({ ...formData, storeType: next.join(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await catalogApi.updateProduct(formData.id, formData);
      } else {
        await catalogApi.addProduct(formData);
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const url = await catalogApi.uploadImage(file);
        setFormData({ ...formData, imageUrl: url });
      } catch (error) {
        alert(error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="form-panel glass">
      <h3>{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label>Nombre del Producto</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Radio Android 9 Pulgadas CarPlay" />
          </div>
        </div>

        {/* Sección: Canales de Publicación / Catálogos */}
        <div className="form-catalog-section">
          <div className="section-meta-header">
            <span className="section-meta-title">Publicar en Catálogos</span>
            <span className="section-meta-subtitle">Selecciona una o más tiendas donde estará visible el producto</span>
          </div>

          <div className="catalog-list-group">
            {/* AutoLook */}
            <div 
              type="button"
              className={`catalog-list-item ${selectedCatalogs.includes('autolook') ? 'is-active' : ''}`}
              onClick={() => toggleCatalog('autolook')}
              tabIndex={0}
              role="checkbox"
              aria-checked={selectedCatalogs.includes('autolook')}
            >
              <div className="catalog-item-main">
                <div className="catalog-item-icon-box">
                  <Car size={18} strokeWidth={2.2} />
                </div>
                <div className="catalog-item-info">
                  <span className="catalog-item-name">AutoLook</span>
                  <span className="catalog-item-desc">Carros, lujos y repuestos automotrices</span>
                </div>
              </div>
              <div className={`catalog-item-check ${selectedCatalogs.includes('autolook') ? 'checked' : ''}`}>
                {selectedCatalogs.includes('autolook') && <Check size={13} strokeWidth={3} />}
              </div>
            </div>

            {/* MotoLook */}
            <div 
              type="button"
              className={`catalog-list-item ${selectedCatalogs.includes('motolook') ? 'is-active' : ''}`}
              onClick={() => toggleCatalog('motolook')}
              tabIndex={0}
              role="checkbox"
              aria-checked={selectedCatalogs.includes('motolook')}
            >
              <div className="catalog-item-main">
                <div className="catalog-item-icon-box">
                  <Bike size={18} strokeWidth={2.2} />
                </div>
                <div className="catalog-item-info">
                  <span className="catalog-item-name">MotoLook</span>
                  <span className="catalog-item-desc">Motos, repuestos y accesorios</span>
                </div>
              </div>
              <div className={`catalog-item-check ${selectedCatalogs.includes('motolook') ? 'checked' : ''}`}>
                {selectedCatalogs.includes('motolook') && <Check size={13} strokeWidth={3} />}
              </div>
            </div>

            {/* Tecnología (GPS, Radios, Sensores) */}
            <div 
              type="button"
              className={`catalog-list-item ${selectedCatalogs.includes('techlook') ? 'is-active' : ''}`}
              onClick={() => toggleCatalog('techlook')}
              tabIndex={0}
              role="checkbox"
              aria-checked={selectedCatalogs.includes('techlook')}
            >
              <div className="catalog-item-main">
                <div className="catalog-item-icon-box">
                  <Radio size={18} strokeWidth={2.2} />
                </div>
                <div className="catalog-item-info">
                  <span className="catalog-item-name">Tecnología</span>
                  <span className="catalog-item-desc">GPS, pantallas CarPlay y sensores</span>
                </div>
              </div>
              <div className={`catalog-item-check ${selectedCatalogs.includes('techlook') ? 'checked' : ''}`}>
                {selectedCatalogs.includes('techlook') && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Categoría</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Repuestos">Repuestos</option>
              <option value="Lujos">Lujos</option>
              <option value="Radios">Radios</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Iluminación">Iluminación</option>
              <option value="Aerodinámica">Aerodinámica</option>
              <option value="Performance">Performance</option>
              <option value="Rines">Rines</option>
              <option value="GPS y Rastreo">GPS y Rastreo</option>
              <option value="Sensores">Sensores</option>
              <option value="Radios y Comunicación">Radios y Comunicación</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div className="form-group">
            <label>Marca del Producto</label>
            <input type="text" placeholder="Ej: Pirelli, Brembo..." value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <label>Precio Mínimo ($)</label>
              <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} placeholder="Ej: 50000" />
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <label>Precio Máximo (Opcional)</label>
              <input type="number" min="0" value={formData.priceMax} onChange={e => setFormData({...formData, priceMax: e.target.value ? Number(e.target.value) : ''})} placeholder="Opcional" />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label>Descripción del Producto</label>
            <textarea 
              rows="3" 
              placeholder="Añade detalles específicos de este producto..."
              value={formData.description || ''} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="form-group file-upload-wrapper">
          <label>Imagen del Producto (PNG/JPG)</label>
          <div className="file-input-container">
            <input type="file" id="file" accept="image/png, image/jpeg" onChange={handleImageUpload} className="file-input-hidden" />
            <label htmlFor="file" className="btn btn-outline file-btn">
              Subir Archivo
            </label>
            <span className="file-selected-text">
              {isUploading ? 'Subiendo imagen a Supabase...' : (formData.imageUrl ? '✓ Imagen subida con éxito' : 'Ningún archivo seleccionado')}
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} className="btn btn-outline" disabled={isUploading}>Cancelar</button>}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
