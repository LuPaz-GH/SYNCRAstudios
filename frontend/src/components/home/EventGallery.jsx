import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../common/Icon'
import { imageUrl, instagramEmbed } from '../../utils/media'

const KIND = { image: 'foto', video: 'video', instagram: 'publicación de Instagram' }

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

// Foto, video o publicación de Instagram en grande, con flechas para pasar al anterior o al siguiente.
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

  let content
  if (item.type === 'video') {
    content = <video key={item.src} src={item.src} controls autoPlay playsInline className="lightbox__video" />
  } else if (item.type === 'instagram') {
    content = <InstagramPost key={item.src} item={item} />
  } else {
    content = <img key={item.src} src={imageUrl(item.src, 2000)} alt={item.label || ''} className="lightbox__video" />
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
        {content}
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

// Miniatura de cada cosa: la foto, el primer cuadro del video, o la portada (o el logo) de Instagram.
function Tile({ item, compact }) {
  if (item.type === 'instagram' && item.cover) {
    return (
      <>
        <img src={imageUrl(item.cover, compact ? 400 : 700)} alt="" loading="lazy" />
        <span className="gallery__badge" aria-hidden="true">
          <Icon name="instagram" size={compact ? 16 : 20} />
        </span>
      </>
    )
  }
  if (item.type === 'instagram') {
    return (
      <span className="gallery__ig" aria-hidden="true">
        <Icon name="instagram" size={compact ? 30 : 44} />
        {!compact && 'Ver en Instagram'}
      </span>
    )
  }
  if (item.type === 'video') {
    return (
      <>
        {/* "#t=0.1" hace que el celular muestre el primer cuadro en vez de un recuadro negro */}
        <video src={`${item.src}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} />
        <span className="gallery__play" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </>
    )
  }
  return <img src={imageUrl(item.src, compact ? 400 : 700)} alt="" loading="lazy" />
}

// Galería de un evento: todo en miniaturas del mismo tamaño, que se agrandan al tocarlas.
export default function EventGallery({ items, compact = false }) {
  const [open, setOpen] = useState(null)
  if (!items.length) return null

  const move = (step) => setOpen((i) => (i + step + items.length) % items.length)

  return (
    <div className={`gallery${compact ? ' gallery--compact' : ''}`}>
      <ul className="gallery__grid">
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              className="gallery__tile"
              onClick={() => setOpen(i)}
              aria-label={`Ver ${KIND[item.type]}${item.label ? `: ${item.label}` : ''}`}
            >
              <Tile item={item} compact={compact} />
              {item.label && <span className="gallery__label">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Viewer items={items} index={open} onMove={move} onClose={() => setOpen(null)} />}
    </div>
  )
}
