import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../common/Icon'
import VideoFeature from './VideoFeature'
import { imageUrl, instagramEmbed } from '../../utils/media'

const KIND = { image: 'foto', instagram: 'publicación de Instagram' }

// Publicación de Instagram incrustada. Instagram avisa qué alto necesita y el recuadro se ajusta.
function InstagramPost({ item }) {
  const frame = useRef(null)
  const [height, setHeight] = useState(null)

  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== 'https://www.instagram.com' || e.source !== frame.current?.contentWindow) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.type === 'MEASURE' && data.details?.height) setHeight(Math.ceil(data.details.height))
      } catch {
        // otros mensajes de Instagram: no nos interesan
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <iframe
      ref={frame}
      className="lightbox__insta"
      src={instagramEmbed(item.src)}
      title={item.label ? `Instagram: ${item.label}` : 'Publicación de Instagram'}
      style={height ? { height } : undefined}
    />
  )
}

// Foto o publicación de Instagram en grande, con flechas para pasar a la anterior o la siguiente.
function Viewer({ items, index, onMove, onClose }) {
  const dialog = useRef(null)
  const item = items[index]

  useEffect(() => {
    const scrollY = window.scrollY
    const trigger = document.activeElement
    dialog.current.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      // Volvemos al mismo lugar de la página, sin saltos (ver VideoFeature).
      trigger?.focus?.({ preventScroll: true })
      window.scrollTo({ top: scrollY, behavior: 'instant' })
    }
  }, [])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') onMove(-1)
    if (e.key === 'ArrowRight') onMove(1)
  }

  return createPortal(
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label={item.label || KIND[item.type]}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={onKeyDown}
    >
      <div className="lightbox__inner">
        <div className="lightbox__bar">
          <span className="video__live">{item.label || (items.length > 1 ? `${index + 1} de ${items.length}` : KIND[item.type])}</span>
          <button type="button" className="lightbox__close" onClick={onClose} aria-label="Cerrar" autoFocus>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {item.type === 'instagram' ? (
          <InstagramPost key={item.src} item={item} />
        ) : (
          <img key={item.src} src={imageUrl(item.src, 2000)} alt={item.label || ''} className="lightbox__video" />
        )}
        {items.length > 1 && (
          <div className="lightbox__nav">
            <button type="button" onClick={() => onMove(-1)} aria-label="Anterior">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" onClick={() => onMove(1)} aria-label="Siguiente">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  )
}

// Foto o Instagram en el mismo marco grande que los videos. Al tocarlo se ve completo.
function Frame({ item, onOpen }) {
  const cover = item.type === 'instagram' ? item.cover : item.src
  return (
    <button
      type="button"
      className="video video--vertical media-frame"
      onClick={onOpen}
      aria-label={`Ver ${KIND[item.type]}${item.label ? `: ${item.label}` : ''}`}
      data-spot
      data-tilt
    >
      {item.label && (
        <span className="video__live">
          <span className="live-dot" /> {item.label}
        </span>
      )}
      {cover ? (
        <img src={imageUrl(cover, 700)} alt="" loading="lazy" />
      ) : (
        <span className="media-frame__ig">
          <Icon name="instagram" size={56} />
          Ver en Instagram
        </span>
      )}
      {item.type === 'instagram' && cover && (
        <span className="media-frame__badge" aria-hidden="true">
          <Icon name="instagram" size={20} />
        </span>
      )}
    </button>
  )
}

// Fotos, videos e Instagram de un evento, grandes y uno al lado del otro.
// Si son muchos, se deslizan de costado.
export default function EventMedia({ items }) {
  const [open, setOpen] = useState(null)
  const others = items.filter((item) => item.type !== 'video')
  const move = (step) => setOpen((i) => (i + step + others.length) % others.length)

  return (
    <div className={`showcase__videos${items.length > 2 ? ' showcase__videos--scroll' : ''}`} data-reveal>
      {items.map((item) =>
        item.type === 'video' ? (
          <VideoFeature key={item.src} src={item.src} label={item.label} />
        ) : (
          <Frame key={item.src} item={item} onOpen={() => setOpen(others.indexOf(item))} />
        ),
      )}
      {open !== null && <Viewer items={others} index={open} onMove={move} onClose={() => setOpen(null)} />}
    </div>
  )
}
