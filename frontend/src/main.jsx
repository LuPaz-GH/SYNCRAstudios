import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Primero los colores y estilos base; después App (que trae App.css).
import './index.css'
import App from './App.jsx'
import { applyA11y, loadA11y } from './utils/accessibility'

// Aplicamos las preferencias de accesibilidad guardadas antes de dibujar la página.
applyA11y(loadA11y())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
