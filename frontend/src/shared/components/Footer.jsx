import React from 'react';
import { Link } from 'react-router-dom';

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

      <style jsx>{`
        .footer {
          border-top: 1px solid var(--card-border);
          background-color: var(--secondary);
          padding-bottom: 2rem;
          padding-top: 4rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .footer-brand h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .footer-brand p {
          color: white;
          max-width: 300px;
          margin-bottom: 2rem;
        }
        .footer-links h4 {
          margin-bottom: 1.5rem;
          font-size: 1rem;
          color: white;
        }
        .footer-links ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .footer-links a {
          text-decoration: none;
          color: white;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: var(--primary);
          padding-left: 5px;
        }
        .footer-bottom {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          color: white;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-brand p {
            margin: 0 auto 2rem auto;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
