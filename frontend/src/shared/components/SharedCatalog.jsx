import React, { useState, useEffect } from 'react';
import { SeoHead } from './SeoHead';
import Navbar from './Navbar';
import Footer from './Footer';
import { catalogApi } from '../services/api';
import './SharedCatalog.css';

const SharedCatalog = ({ storeType, title, subtitle, categories, themeClass, hideLayout = false }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [filterMode, setFilterMode] = useState('category'); // 'category' o 'brand'
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 12;

  async function fetchCatalog(isLoadMore = false) {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const currentOffset = isLoadMore ? offset : 0;
      const { data, count } = await catalogApi.getProducts(storeType || 'todos', LIMIT, currentOffset);
      
      const newProducts = isLoadMore ? [...products, ...data] : data;
      setProducts(newProducts);
      setFilteredProducts(newProducts);
      setTotalCount(count || 0);
      
      if (!isLoadMore) {
        setOffset(LIMIT);
      } else {
        setOffset(prev => prev + LIMIT);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    // Si no está escondiendo el layout, haz scroll top.
    if (!hideLayout) {
      window.scrollTo(0, 0);
    }
    fetchCatalog();

    const handleStorageChange = (e) => {
      if (e.key === 'catalog_products') fetchCatalog();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storeType]);

  const handleFilter = (filterValue, mode = filterMode) => {
    setActiveCategory(filterValue);
    
    if (filterValue === 'Todos') {
      setFilteredProducts(products);
      return;
    }

    const value = filterValue.trim().toLowerCase();

    if (mode === 'category') {
      setFilteredProducts(products.filter(p => 
        p.category && p.category.trim().toLowerCase() === value
      ));
    } else {
      setFilteredProducts(products.filter(p => 
        p.brand && p.brand.trim().toLowerCase() === value
      ));
    }
  };

  const handleModeToggle = (mode) => {
    setFilterMode(mode);
    handleFilter('Todos', mode);
  };

  const uniqueBrands = ['Todos', ...new Set(products.map(p => p.brand).filter(Boolean))];
  const activeFilters = filterMode === 'category' ? categories : uniqueBrands;

  const handleWhatsAppQuote = (productName) => {
    const phoneNumber = "573018265636"; // Número real de AutoLook
    const message = `¡Hola! Me gustaría cotizar y saber si tienen en stock el producto: ${productName}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`catalog-page ${themeClass}`} style={hideLayout ? { minHeight: 'auto', paddingTop: '2rem', paddingBottom: '2rem' } : {}}>
      <SeoHead 
        title={title} 
        description={subtitle} 
        keywords={`repuestos, lujos, accesorios, ${storeType || 'autos y motos'}, ${categories ? categories.join(', ') : ''}`} 
      />
      {!hideLayout && <Navbar />}

      <main className={`catalog-content ${hideLayout ? '' : 'section-padding'}`} id="catalog-section">
        <div className="container">
          <div className="catalog-header text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="neon-text accent-color" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>{title}</h2>
            <p className="text-dim mt-2" style={{ marginBottom: '2rem' }}>{subtitle}</p>
          </div>

          {/* Filter Mode Toggle (Oculto temporalmente) */}
          <div style={{ display: 'none', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={`btn ${filterMode === 'category' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleModeToggle('category')}
              style={{ padding: '0.4rem 1.5rem', borderRadius: '30px' }}
            >
              Filtrar por Categoría
            </button>
            <button 
              className={`btn ${filterMode === 'brand' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleModeToggle('brand')}
              style={{ padding: '0.4rem 1.5rem', borderRadius: '30px' }}
            >
              Filtrar por Marca
            </button>
          </div>

          {/* Filters (Oculto temporalmente) */}
          <div className="filters-container glass" style={{ display: 'none', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem', padding: '1.5rem', borderRadius: '16px' }}>
            {activeFilters.map(filterOption => (
              <button 
                key={filterOption} 
                className={`filter-btn ${activeCategory === filterOption ? 'active' : ''}`}
                onClick={() => handleFilter(filterOption)}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando inventario premium...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state glass text-center py-5">
              <h3 style={{color: 'var(--primary)'}}>No hay productos en esta selección</h3>
              <p className="text-dim">Revisa más tarde o contacta a un asesor.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card glass">
                  <div className="product-img-wrapper">
                    <img src={product.imageUrl} alt={product.name} className="product-img" loading="lazy" />
                    <span className="category-badge">{filterMode === 'brand' ? product.category : (product.brand || product.category)}</span>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price-row">
                      <span className="price">
                        ${product.price.toLocaleString()}
                        {product.price_max ? ` - $${product.price_max.toLocaleString()}` : ''}
                      </span>
                    </div>
                    <button 
                      className="btn btn-outline w-full quote-btn mt-3"
                      onClick={() => handleWhatsAppQuote(product.name)}
                    >
                      Cotizar por WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón Cargar Más */}
          {!loading && products.length < totalCount && (
            <div className="text-center" style={{ marginTop: '3rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => fetchCatalog(true)}
                disabled={loadingMore}
                style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
              >
                {loadingMore ? 'Cargando...' : 'Cargar más productos'}
              </button>
            </div>
          )}
        </div>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default SharedCatalog;
