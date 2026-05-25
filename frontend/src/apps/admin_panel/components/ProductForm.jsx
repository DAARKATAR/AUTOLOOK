import React from 'react';
import { catalogApi } from '../../../../shared/services/api';

const ProductForm = ({ formData, setFormData, isEditing, isUploading, setIsUploading, resetForm, fetchProducts }) => {

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
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Sucursal / Vehículo</label>
            <select value={formData.storeType} onChange={e => setFormData({...formData, storeType: e.target.value})}>
              <option value="motolook">Moto (MotoLook)</option>
              <option value="autolook">Carro (AutoLook)</option>
              <option value="general">Universal (Para todo vehículo)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Repuestos">Repuestos</option>
              <option value="Lujos">Lujos</option>
              <option value="Seguridad">Seguridad</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Iluminación">Iluminación</option>
              <option value="Aerodinámica">Aerodinámica</option>
              <option value="Performance">Performance</option>
              <option value="Rines">Rines</option>
            </select>
          </div>
          <div className="form-group">
            <label>Marca del Producto</label>
            <input type="text" placeholder="Ej: Pirelli, Brembo..." value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Precio ($)</label>
            <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
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
