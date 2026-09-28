import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

// Video destacado: se reproduce sin sonido solo cuando está en pantalla,
// con botones para pausar, activar el audio y agrandarlo. Se adapta a videos verticales u horizontales.
export default function VideoFeature({ src, label }) {
  const videoRef = useRef(null)
  const dialogRef = useRef(null)
  const bigRef = useRef(null)
  const reduced = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [vertical, setVertical] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const userPaused = useRef(reduced)

  useEffect(() => {
    const video = videoRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => {})
        else if (!entry.isIntersecting) video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)

    // Si otro video activa su sonido, este se silencia para que no se superpongan.
    const onOtherUnmuted = (e) => {
      if (e.detail === video) return
      video.muted = true
      setMuted(true)
    }
    window.addEventListener('syncra:unmute', onOtherUnmuted)

    return () => {
      observer.disconnect()
      window.removeEventListener('syncra:unmute', onOtherUnmuted)
    }
  }, [])

  // Vista ampliada: el video grande arranca donde iba el chico, con sonido,
  // y al cerrarla el chico sigue desde donde quedó el grande.
  useEffect(() => {
    if (!expanded) return
    const small = videoRef.current
    const big = bigRef.current
    const wasPlaying = !small.paused
    const trigger = document.activeElement

    small.pause()
    big.currentTime = small.currentTime
    dialogRef.current.showModal()
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('syncra:unmute', { detail: big }))
    big.play().catch(() => {})

    return () => {
      small.currentTime = big.currentTime
      document.body.style.overflow = ''
      if (wasPlaying) small.play().catch(() => {})
      trigger?.focus()
    }
  }, [expanded])

  const togglePlay = () => {
    const video = videoRef.current
    if (video.paused) {
      userPaused.current = false
      video.play()
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    video.muted = !video.muted
    setMuted(video.muted)
    if (!video.muted) window.dispatchEvent(new CustomEvent('syncra:unmute', { detail: video }))
    if (!video.muted && video.paused) togglePlay()
  }

  const close = () => setExpanded(false)

  return (
    <div className={`video ${vertical ? 'video--vertical' : 'video--horizontal'}`} data-spot data-tilt>
      <span className="video__live">
        <span className="live-dot" /> {label}
      </span>
      <button
        type="button"
        className="video__expand"
        onClick={() => setExpanded(true)}
        aria-label={`Ver video ${label} en grande`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      </button>

      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setVertical(e.target.videoHeight >= e.target.videoWidth)}
        aria-label={label}
      />
      <div className="video__controls">
        <button type="button" onClick={togglePlay} aria-label={playing ? 'Pausar video' : 'Reproducir video'}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          )}
          <span>{muted ? 'Activar sonido' : 'Sonido activado'}</span>
        </button>
      </div>

      {expanded &&
        createPortal(
          <dialog
            ref={dialogRef}
            className="lightbox"
            aria-label={`Video: ${label}`}
            onCancel={(e) => {
              e.preventDefault()
              close()
            }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="lightbox__inner">
              <div className="lightbox__bar">
                <span className="video__live">
                  <span className="live-dot" /> {label}
                </span>
                <button type="button" className="lightbox__close" onClick={close} aria-label="Cerrar video" autoFocus>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <video ref={bigRef} src={src} controls playsInline loop className="lightbox__video" />
            </div>
          </dialog>,
          document.body,
        )}
    </div>
  )
}
