import React, { useState } from 'react';
import { Car, Bike, Radio, Check, AlertCircle } from 'lucide-react';
import { catalogApi } from '../../../shared/services/api';
import CustomAlertModal from '../../../shared/components/CustomAlertModal';

const ProductForm = ({ formData, setFormData, isEditing, isUploading, setIsUploading, resetForm, fetchProducts }) => {
  const [imageError, setImageError] = useState('');
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title, message) => {
    setAlertModal({
      isOpen: true,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

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
        showAlert('Catálogo Obligatorio', 'El producto debe pertenecer al menos a una tienda o catálogo.');
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

    // Validar obligatoriedad de imagen
    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      setImageError('Es obligatorio subir una imagen del producto antes de guardarlo.');
      showAlert('Imagen Obligatoria', 'No se puede crear el producto sin una fotografía. Por favor, sube una imagen de tu producto en formato PNG o JPG.');
      return;
    }

    setImageError('');
    try {
      if (isEditing) {
        await catalogApi.updateProduct(formData.id, formData);
      } else {
        await catalogApi.addProduct(formData);
      }
      resetForm();
      setImageError('');
      fetchProducts();
    } catch (error) {
      showAlert('Error al Guardar', error.message || 'Ocurrió un problema al guardar el producto en el catálogo.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        setImageError('');
        const url = await catalogApi.uploadImage(file);
        setFormData({ ...formData, imageUrl: url });
      } catch (error) {
        showAlert('Error al Subir Imagen', error.message || 'No se pudo subir la imagen.');
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
          <label>
            Imagen del Producto (PNG/JPG) <span style={{ color: 'var(--primary)', fontWeight: 700 }}>* (Obligatorio)</span>
          </label>
          <div className={`file-input-container ${imageError ? 'file-input-error' : ''}`}>
            <input type="file" id="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="file-input-hidden" />
            <label htmlFor="file" className="btn btn-outline file-btn">
              Subir Archivo
            </label>
            <span className="file-selected-text">
              {isUploading ? 'Subiendo imagen a Supabase...' : (formData.imageUrl ? '✓ Imagen subida con éxito' : 'Ningún archivo seleccionado')}
            </span>
          </div>

          {/* Mensaje de error si falta la imagen */}
          {imageError && (
            <div className="file-error-badge">
              <AlertCircle size={15} />
              <span>{imageError}</span>
            </div>
          )}

          {/* Vista previa miniatura de la imagen cargada */}
          {formData.imageUrl && !isUploading && (
            <div className="uploaded-image-preview">
              <img src={formData.imageUrl} alt="Vista previa del producto" className="uploaded-preview-img" />
              <span className="uploaded-preview-text">Vista previa cargada correctamente</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} className="btn btn-outline" disabled={isUploading}>Cancelar</button>}
        </div>
      </form>

      {/* Modal personalizado de advertencias y errores */}
      <CustomAlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type="warning"
        confirmText="Entendido"
      />
    </div>
  );
};

export default ProductForm;
