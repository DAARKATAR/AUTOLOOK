import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const Maintenance = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999
  }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ff4444' }}>Acceso Suspendido</h1>
    <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.5', color: '#aaaaaa' }}>
      El sitio web se encuentra temporalmente suspendido. <br/><br/>
      Por favor, contacte con el desarrollador o administrador del sistema para resolver este inconveniente y restablecer el servicio.
    </p>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Maintenance />
  </StrictMode>,
)
