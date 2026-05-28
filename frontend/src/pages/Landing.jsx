import React, { useState } from 'react';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import SharedCatalog from '../shared/components/SharedCatalog';
import './Landing.css';

const Landing = () => {
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const handleSelectCatalog = (type) => {
    setSelectedCatalog(type);
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="unified-landing">
      <Navbar />
      
      {/* Hero Section con Video Background */}
      <section className="hero-premium" id="home">
        <div className="hero-video-wrapper">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="hero-video"
            poster="https://images.unsplash.com/photo-1549557451-b847ae91b107?q=80&w=2000&auto=format&fit=crop"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-gradient-overlay"></div>
        </div>
        
        <div className="container hero-content-premium">
          <h1 className="hero-title-premium">
            <span style={{ display: 'block', fontSize: '0.4em', color: '#00ffcc', letterSpacing: '2px', marginBottom: '10px' }}>
              REPUESTOS, LUJOS Y ACCESORIOS PARA
            </span>
            <span className="text-transparent bg-clip-text gradient-neon">AUTOS Y MOTOS</span>
          </h1>
          <p className="hero-subtitle-premium">
            Descubre el catálogo definitivo de accesorios de alto rendimiento, lujo aerodinámico y repuestos premium para motos y automóviles.
          </p>
          
          <div className="hero-cards-grid animate-fade-in-up">
            <div className="luxury-card moto-card animate-float" onClick={() => handleSelectCatalog('motolook')}>
              <div className="card-overlay"></div>
              <div className="card-content">
                <h3>MOTOCICLETAS</h3>
                <p>Repuestos • Lujos • Seguridad</p>
                <span className="btn-glow">Ver Catálogo 🏍️</span>
              </div>
            </div>

            <div className="luxury-card auto-card animate-float-delayed" onClick={() => handleSelectCatalog('autolook')}>
              <div className="card-overlay"></div>
              <div className="card-content">
                <h3>AUTOMÓVILES</h3>
                <p>Rines • Aerodinámica • Iluminación</p>
                <span className="btn-glow auto-glow">Ver Catálogo 🚗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee de Marcas (Cinta infinita) */}
      <div className="brands-marquee">
        <div className="marquee-content">
          <span>PIRELLI</span> • <span>BREMBO</span> • <span>AKRAPOVIC</span> • <span>MICHELIN</span> • <span>SPARCO</span> • <span>YOSHIMURA</span> • <span>MOTUL</span> • <span>K&N</span> • 
          <span>PIRELLI</span> • <span>BREMBO</span> • <span>AKRAPOVIC</span> • <span>MICHELIN</span> • <span>SPARCO</span> • <span>YOSHIMURA</span> • <span>MOTUL</span> • <span>K&N</span>
        </div>
      </div>

      {/* Embedded Catalog Section */}
      {selectedCatalog && (
        <section id="catalog-section" className="catalog-wrapper-premium animate-fade-in">
          {selectedCatalog === 'autolook' ? (
             <SharedCatalog 
              storeType="autolook"
              themeClass="theme-auto"
              title="COLECCIÓN AUTOLOOK"
              subtitle="Equipamiento de nivel competitivo para tu vehículo."
              categories={['Todos', 'Aerodinámica', 'Rines', 'Performance', 'Iluminación']} 
              hideLayout={true}
            />
          ) : (
            <SharedCatalog 
              storeType="motolook"
              themeClass="theme-moto"
              title="COLECCIÓN MOTOLOOK"
              subtitle="Accesorios y repuestos para dominar el asfalto."
              categories={['Todos', 'Repuestos', 'Lujos', 'Seguridad', 'Accesorios']} 
              hideLayout={true}
            />
          )}
        </section>
      )}

      {/* Quiénes Somos Section */}
      <section className="about-us-premium animate-fade-in-up" id="about">
        <div className="container">
          <div className="about-content-wrapper">
            <div className="about-image-container">
              <img src="/quienes-somos.jpg" alt="Autolook Colombia Instalaciones" className="about-image blur-effect animate-float" />
              <div className="about-image-glow"></div>
            </div>
            <div className="about-text-container">
              <span className="subtitle-accent">NUESTRA HISTORIA</span>
              <h2>AUTOLOOK <span className="gradient-neon">COLOMBIA</span></h2>
              <p>
                <strong>Más de 15 años de experiencia.</strong> Nacimos en Bogotá a partir del trabajo conjunto con diferentes concesionarios de carros, lo que nos dio la experiencia y el conocimiento para brindar el mejor servicio en la ciudad y zonas aledañas. Hoy contamos con nuestro punto físico principal en <strong>Funza (Calle 13 #10-04)</strong>.
              </p>
              
              <h3 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>Nuestra Misión</h3>
              <p>
                Ser un aliado confiable para nuestros clientes con instalación profesional de accesorios para vehículos, ofreciendo los mejores productos del mercado al mejor precio y garantizando excelencia y atención personalizada.
              </p>

              <h3 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>¿Por qué elegirnos?</h3>
              <p>
                Prestamos el mejor servicio de instalaciones profesionales limpias, seguras y garantizadas utilizando productos de alta calidad y al mejor precio. Nuestra experiencia de más de 15 años trabajando con concesionarios y particulares nos han convertido en un aliado confiable y recomendado dentro del sector automotriz.
              </p>
              
              <div style={{ marginTop: '2rem', padding: '1rem', borderLeft: '4px solid var(--primary)', backgroundColor: 'rgba(255,255,255,0.03)', fontStyle: 'italic' }}>
                "Si llevo mi vehículo a Autolook, sé que está en buenas manos, tendré una buena instalación, garantía y producto."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Premium Section */}
      <section className="services-premium" id="services">
        <div className="container">
          <div className="section-header-modern text-center">
            <span className="subtitle-accent">EXPERIENCIA VIP</span>
            <h2>Servicios Especializados</h2>
          </div>
          
          <div className="modern-services-grid">
            <div className="service-item glass-blur">
              <div className="service-icon">⚡</div>
              <h3>Performance & Tuning</h3>
              <p>Optimizamos el rendimiento de tu motor con piezas importadas de competición.</p>
            </div>
            <div className="service-item glass-blur">
              <div className="service-icon">✨</div>
              <h3>Detailing Premium</h3>
              <p>Restauración de pintura, recubrimiento cerámico y limpieza de interiores al detalle.</p>
            </div>
            <div className="service-item glass-blur">
              <div className="service-icon">🛡️</div>
              <h3>Seguridad & Control</h3>
              <p>Instalación de GPS, alarmas inteligentes y láminas de seguridad blindadas.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
