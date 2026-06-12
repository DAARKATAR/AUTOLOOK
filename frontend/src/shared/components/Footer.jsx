import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer section-padding">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <img src="/icon.png" alt="AutoLook Logo" style={{ height: '35px', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '2px', color: 'white' }}>AUTOLOOK</span>
            </div>
            <p>Pasión por los motores, compromiso con tu seguridad y el lujo.</p>
          </div>
          
          <div className="footer-links">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#about">Quiénes Somos</a></li>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#location">Ubicación</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DAARK TECH SOLUTIONS. Todos los derechos reservados.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
