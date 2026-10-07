import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './CustomAlertModal.css';

const CustomAlertModal = ({
  isOpen,
  onClose,
  title = "Atención Requerida",
  message = "",
  type = "warning", // 'warning' | 'error' | 'confirm'
  onConfirm = null,
  confirmText = "Entendido",
  cancelText = "Cancelar"
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isConfirm = type === 'confirm' && typeof onConfirm === 'function';

  return (
    <div className="custom-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="custom-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="custom-modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="custom-modal-header">
          <div className="custom-modal-icon-wrapper">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <h3 className="custom-modal-title">{title}</h3>
        </div>

        <div className="custom-modal-body">
          <p className="custom-modal-message">{message}</p>
        </div>

        <div className="custom-modal-actions">
          {isConfirm ? (
            <>
              <button 
                type="button" 
                className="custom-modal-btn custom-modal-btn-cancel" 
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className="custom-modal-btn custom-modal-btn-confirm" 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="custom-modal-btn custom-modal-btn-primary" 
              onClick={onClose}
              autoFocus
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlertModal;
