import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { A11Y_DEFAULTS, loadA11y, saveA11y } from '../../utils/accessibility'

const TEXT_SIZES = [
  { value: 0, label: 'A', name: 'Normal' },
  { value: 1, label: 'A+', name: 'Grande' },
  { value: 2, label: 'A++', name: 'Muy grande' },
]

// Botón flotante (abajo a la izquierda) con opciones de accesibilidad para cada visitante:
// tamaño de letra, alto contraste y pausar animaciones. Se recuerdan para la próxima visita.
export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(loadA11y)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  const update = (changes) => {
    const next = { ...settings, ...changes }
    setSettings(next)
    saveA11y(next)
  }

  // Al abrir, el foco va al panel; Escape o un clic afuera lo cierran y el foco vuelve al botón.
  useEffect(() => {
    if (!open) return
    panelRef.current.querySelector('button').focus()

    const close = () => {
      setOpen(false)
      buttonRef.current.focus()
    }
    const onKey = (e) => e.key === 'Escape' && close()
    const onClick = (e) => {
      if (!panelRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  const changed = JSON.stringify(settings) !== JSON.stringify(A11Y_DEFAULTS)

  return (
    <div className="a11y">
      {open && (
        <div className="a11y__panel" ref={panelRef} role="dialog" aria-label="Opciones de accesibilidad">
          <p className="a11y__title">Accesibilidad</p>

          <div className="a11y__group" role="group" aria-labelledby="a11y-text">
            <span id="a11y-text" className="a11y__label">
              <Icon name="text" size={20} /> Tamaño del texto
            </span>
            <div className="a11y__sizes">
              {TEXT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  className="a11y__size"
                  aria-pressed={settings.textSize === size.value}
                  aria-label={`Texto ${size.name.toLowerCase()}`}
                  onClick={() => update({ textSize: size.value })}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="a11y__toggle"
            role="switch"
            aria-checked={settings.contrast}
            onClick={() => update({ contrast: !settings.contrast })}
          >
            <Icon name="contrast" size={20} />
            <span>Alto contraste</span>
            <span className="a11y__switch" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="a11y__toggle"
            role="switch"
            aria-checked={settings.still}
            onClick={() => update({ still: !settings.still })}
          >
            <Icon name="pause" size={20} />
            <span>Pausar animaciones</span>
            <span className="a11y__switch" aria-hidden="true" />
          </button>

          {changed && (
            <button type="button" className="a11y__reset" onClick={() => update(A11Y_DEFAULTS)}>
              Volver a como estaba
            </button>
          )}
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        className="a11y__button"
        aria-expanded={open}
        aria-label="Opciones de accesibilidad"
        title="Accesibilidad"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="access" size={32} />
      </button>
    </div>
  )
}
