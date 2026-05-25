import React from 'react';
import { useLocation } from 'react-router-dom';
import './WhatsAppFloat.css';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const location = useLocation();
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '573018265636';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("¡Hola! Quisiera más información sobre los repuestos y accesorios de su catálogo.")}`;

  // Ocultar en el panel de administrador y login
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/login')) {
    return null;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-float">
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppFloat;
