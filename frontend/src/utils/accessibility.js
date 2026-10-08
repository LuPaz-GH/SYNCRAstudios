// Preferencias de accesibilidad que elige cada visitante (tamaño de letra, contraste, animaciones).
// Se guardan en su navegador y se aplican como clases en <html>, así el CSS y los hooks las ven.

const KEY = 'syncra-a11y'
export const A11Y_DEFAULTS = { textSize: 0, contrast: false, still: false }
export const A11Y_EVENT = 'syncra:a11y'

export function loadA11y() {
  try {
    return { ...A11Y_DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...A11Y_DEFAULTS }
  }
}

export function applyA11y(settings) {
  const root = document.documentElement
  if (settings.textSize) root.dataset.textSize = String(settings.textSize)
  else delete root.dataset.textSize
  root.classList.toggle('a11y-contrast', settings.contrast)
  root.classList.toggle('a11y-still', settings.still)
  window.dispatchEvent(new Event(A11Y_EVENT))
}

export function saveA11y(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // Sin acceso al almacenamiento (modo privado, etc.): igual se aplica mientras dure la visita.
  }
  applyA11y(settings)
}

// ¿La persona pidió frenar las animaciones desde la barra de accesibilidad?
export const isStill = () => document.documentElement.classList.contains('a11y-still')
