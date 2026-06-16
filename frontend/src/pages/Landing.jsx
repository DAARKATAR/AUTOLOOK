import React, { useState, useEffect, useRef } from 'react';
import { SeoHead } from '../shared/components/SeoHead';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import SharedCatalog from '../shared/components/SharedCatalog';
import { Wrench, ShieldCheck, Award } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [catalogKey, setCatalogKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [selectedCatalog]); // Re-run when catalog changes to observe new elements

  const handleSelectCatalog = (type) => {
    setSelectedCatalog(type);
    setCatalogKey(prev => prev + 1); // Force re-render of catalog for animation
    setTimeout(() => {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    "name": "AutoLook & MotoLook",
    "image": "https://tudominio.com/quienes-somos.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle 13 #10-04",
      "addressLocality": "Funza",
      "addressRegion": "Cundinamarca",
      "addressCountry": "CO"
    },
    "telephone": "+573018265636",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ]
  };

  return (
    <div className="unified-landing">
      <SeoHead 
        title="Repuestos, Lujos y Accesorios" 
        description="El mejor catálogo de repuestos, lujos, accesorios de alto rendimiento, GPS, sensores y radios para autos y motos en Funza. Todas las marcas: Pirelli, Brembo y más."
        schema={localBusinessSchema} 
      />
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
            <span style={{ display: 'block', fontSize: '0.4em', color: 'var(--text-dim)', letterSpacing: '2px', marginBottom: '10px' }}>
              REPUESTOS, LUJOS Y ACCESORIOS PARA
            </span>
            <span className="text-transparent bg-clip-text gradient-neon">AUTOS Y MOTOS</span>
          </h1>
          <p className="hero-subtitle-premium">
            Descubre el catálogo definitivo de accesorios de alto rendimiento, lujo aerodinámico y repuestos premium para motos y automóviles.
          </p>
          
          <div className="hero-cards-grid animate-on-scroll">
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

            {/* Catálogo Tecnología (GPS, Sensores, Radios) */}
            <div className="luxury-card tech-card animate-float" onClick={() => handleSelectCatalog('techlook')}>
              <div className="card-overlay"></div>
              <div className="card-content">
                <h3>TECNOLOGÍA Y GPS</h3>
                <p>Radios de Comunicacion • Sensores</p>
                <span className="btn-glow tech-glow">Ver Catálogo 📡</span>
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


      <div className="content-gradient-wrapper">
        {/* Quiénes Somos Section */}
        <section className="about-us-premium animate-on-scroll" id="about">
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
              
              <h3 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>Nuestra Misión</h3>
              <p>
                Ser un aliado confiable para nuestros clientes con instalación profesional de accesorios para vehículos, ofreciendo los mejores productos del mercado al mejor precio y garantizando excelencia y atención personalizada.
              </p>

              <h3 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--secondary)' }}>¿Por qué elegirnos?</h3>
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
      <section className="services-premium animate-on-scroll" id="services">
        <div className="container">
          <div className="section-header-modern text-center">
            <span className="subtitle-accent">EXPERIENCIA VIP</span>
            <h2>Servicios Especializados</h2>
          </div>
          
          <div className="modern-services-grid">
            <div className="service-item glass-blur">
              <div className="service-icon"><Wrench size={40} color="var(--primary)" /></div>
              <h3>Instalación de Accesorios</h3>
              <p>Instalaciones profesionales, limpias y seguras para autos y motos.</p>
            </div>
            <div className="service-item glass-blur">
              <div className="service-icon"><ShieldCheck size={40} color="var(--primary)" /></div>
              <h3>Productos Premium</h3>
              <p>Utilizamos productos de alta calidad al mejor precio del mercado.</p>
            </div>
            <div className="service-item glass-blur">
              <div className="service-icon"><Award size={40} color="var(--primary)" /></div>
              <h3>Garantía y Experiencia</h3>
              <p>Más de 15 años de trayectoria respaldan nuestro trabajo y atención personalizada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Catalog Section */}
      {selectedCatalog && (
        <section id="catalog-section" key={catalogKey} className="catalog-wrapper-premium animate-fade-in animate-on-scroll">
          {selectedCatalog === 'autolook' ? (
             <SharedCatalog 
              storeType="autolook"
              themeClass="theme-auto"
              title="COLECCIÓN AUTOLOOK"
              subtitle="Equipamiento de nivel competitivo para tu vehículo."
              categories={['Todos', 'Aerodinámica', 'Rines', 'Performance', 'Iluminación']} 
              hideLayout={true}
            />
          ) : selectedCatalog === 'motolook' ? (
            <SharedCatalog 
              storeType="motolook"
              themeClass="theme-moto"
              title="COLECCIÓN MOTOLOOK"
              subtitle="Accesorios y repuestos para dominar el asfalto."
              categories={['Todos', 'Repuestos', 'Lujos', 'Seguridad', 'Accesorios']} 
              hideLayout={true}
            />
          ) : selectedCatalog === 'techlook' ? (
            <SharedCatalog 
              storeType="techlook"
              themeClass="theme-moto"
              title="COLECCIÓN TECNOLOGÍA"
              subtitle="GPS, sensores y comunicación de alta precisión."
              categories={['Todos', 'GPS y Rastreo', 'Sensores', 'Radios y Comunicación', 'Otros']} 
              hideLayout={true}
            />
          ) : null}
        </section>
      )}

      {/* Cómo encontrarnos Section */}
      <section className="location-premium animate-on-scroll" id="location">
        <div className="container">
          <div className="section-header-modern text-center">
            <span className="subtitle-accent">UBICACIÓN Y CONTACTO</span>
            <h2>¿Cómo Encontrarnos?</h2>
          </div>
          
          <div className="location-grid">
            <div className="contact-info-panel">
              <h3>Contacto Directo</h3>
              <ul className="contact-list">
                <li>
                  <span className="icon">📍</span>
                  <span><strong>Dirección:</strong> Calle 13 #10-04, Funza</span>
                </li>
                <li>
                  <span className="icon">✉️</span>
                  <span><strong>Correo:</strong> autolookcolombia@gmail.com</span>
                </li>
                <li>
                  <span className="icon">🕒</span>
                  <span><strong>Horario:</strong> Lunes a Sábado: 8:00am - 6:00pm</span>
                </li>
              </ul>
              
              <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Nuestras Redes</h4>
              <div className="social-links-large">
                <a href="https://wa.me/573018265636" target="_blank" rel="noopener noreferrer" className="social-icon-large" title="WhatsApp" aria-label="Contactar por WhatsApp">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.01 2.01c-5.51 0-9.99 4.48-9.99 9.99 0 1.76.46 3.44 1.32 4.96L2.01 22l5.17-1.36c1.47.78 3.1 1.19 4.82 1.19 5.51 0 9.99-4.48 9.99-9.99S17.52 2.01 12.01 2.01zM17.3 15.54c-.23.64-1.29 1.18-1.78 1.25-.43.06-.97.12-2.83-.65-2.25-.93-3.7-3.25-3.81-3.4-.11-.15-.91-1.22-.91-2.33s.58-1.65.78-1.87c.21-.23.46-.28.61-.28s.32.01.46.01c.15 0 .34-.06.53.4.21.5.55 1.34.6 1.45.05.11.08.24.01.38-.07.15-.11.24-.23.38-.11.14-.24.31-.34.42-.11.12-.23.25-.1.48.13.23.58.96 1.24 1.55.85.76 1.56 1 1.8 1.11.23.11.37.09.51-.06.14-.15.6-1.02.77-1.37.15-.35.31-.29.53-.21.22.08 1.39.65 1.63.77.24.12.4.18.45.28.05.11.05.62-.18 1.25z" /></svg>
                </a>
                <a href="#!" onClick={(e) => e.preventDefault()} className="social-icon-large" title="Instagram (Próximamente)" aria-label="Perfil de Instagram (Próximamente)">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#!" onClick={(e) => e.preventDefault()} className="social-icon-large" title="Facebook (Próximamente)" aria-label="Perfil de Facebook (Próximamente)">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#!" onClick={(e) => e.preventDefault()} className="social-icon-large" title="TikTok (Próximamente)" aria-label="Perfil de TikTok (Próximamente)">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
              </div>
            </div>
            
            <div className="maps-container">
              <iframe 
                src="https://www.google.com/maps?q=Calle+13+%2310-04,+Funza,+Colombia&output=embed" 
                width="100%" 
                height="100%" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Autolook Funza Location"
              ></iframe>
            </div>
          </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Landing;
