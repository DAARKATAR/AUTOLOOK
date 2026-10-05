import React from 'react';
import { useLocation } from 'react-router-dom';
import { getWhatsAppUrl } from '../services/whatsapp';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const location = useLocation();
  const url = getWhatsAppUrl("¡Hola! Quisiera más información sobre los repuestos y accesorios de su catálogo.");

  // Ocultar en el panel de administrador y login
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-float">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12.01 2.01c-5.51 0-9.99 4.48-9.99 9.99 0 1.76.46 3.44 1.32 4.96L2.01 22l5.17-1.36c1.47.78 3.1 1.19 4.82 1.19 5.51 0 9.99-4.48 9.99-9.99S17.52 2.01 12.01 2.01zM17.3 15.54c-.23.64-1.29 1.18-1.78 1.25-.43.06-.97.12-2.83-.65-2.25-.93-3.7-3.25-3.81-3.4-.11-.15-.91-1.22-.91-2.33s.58-1.65.78-1.87c.21-.23.46-.28.61-.28s.32.01.46.01c.15 0 .34-.06.53.4.21.5.55 1.34.6 1.45.05.11.08.24.01.38-.07.15-.11.24-.23.38-.11.14-.24.31-.34.42-.11.12-.23.25-.1.48.13.23.58.96 1.24 1.55.85.76 1.56 1 1.8 1.11.23.11.37.09.51-.06.14-.15.6-1.02.77-1.37.15-.35.31-.29.53-.21.22.08 1.39.65 1.63.77.24.12.4.18.45.28.05.11.05.62-.18 1.25z" /></svg>
    </a>
  );
};

export default WhatsAppFloat;
