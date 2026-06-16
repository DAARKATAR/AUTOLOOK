import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, Package, MapPin } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <img src="/icon.png" alt="AutoLook Logo" className="navbar-icon" />
          <span className="gradient-logo">AUTOLOOK</span>
        </Link>
        <ul className="nav-links">
          {isHome && (
            <>
              <li><a href="#about">Quiénes Somos</a></li>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#catalog-section" onClick={() => { if(!document.getElementById('catalog-section')) { document.getElementById('home')?.scrollIntoView(); } }}>Catálogo</a></li>
              <li><a href="#location">Cómo encontrarnos</a></li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Bottom Navigation (Only visible on max-width 768px via CSS) */}
      {isHome && (
        <div className="mobile-bottom-nav">
          <a href="#home" className="mobile-nav-item">
            <Home size={22} />
            <span>Inicio</span>
          </a>
          <a href="#services" className="mobile-nav-item">
            <Wrench size={22} />
            <span>Servicios</span>
          </a>
          <a href="#catalog-section" className="mobile-nav-item" onClick={(e) => { 
            if(!document.getElementById('catalog-section')) { 
              document.getElementById('home')?.scrollIntoView(); 
            } 
          }}>
            <Package size={22} />
            <span>Catálogo</span>
          </a>
          <a href="#location" className="mobile-nav-item">
            <MapPin size={22} />
            <span>Ubicación</span>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
