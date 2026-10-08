import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Primero los colores y estilos base; después App (que trae App.css).
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
