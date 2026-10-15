import { useRef, useState } from 'react'
import Icon from '../common/Icon'
import { uploadFile } from '../../services/upload.service'
import { imageUrl, instagramUrl } from '../../utils/media'

const TYPE_LABELS = { image: 'Foto', video: 'Video', instagram: 'Instagram' }

function Thumb({ item }) {
  if (item.type === 'image') return <img src={imageUrl(item.src, 160)} alt="" loading="lazy" />
  if (item.type === 'video') return <video src={item.src} preload="metadata" muted playsInline />
  return <Icon name="instagram" />
}

// Fotos, videos y publicaciones de Instagram de un evento.
// "onChange" recibe una función (lista anterior → lista nueva), porque las subidas terminan de a una.
export default function MediaField({ value, onChange, onBusyChange, ctx }) {
  const fileInput = useRef(null)
  const pendingCount = useRef(0)
  const [uploads, setUploads] = useState([])
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  const items = value || []
  const edit = (index, changes) => onChange((list) => list.map((item, i) => (i === index ? { ...item, ...changes } : item)))
  const remove = (index) => onChange((list) => list.filter((_, i) => i !== index))
  const move = (index, step) =>
    onChange((list) => {
      const next = [...list]
      ;[next[index], next[index + step]] = [next[index + step], next[index]]
      return next
    })

  const onFiles = async (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    setError('')
    const pending = files.map((file, i) => ({ id: `${Date.now()}-${i}`, name: file.name, progress: 0 }))
    setUploads((list) => [...list, ...pending])
    pendingCount.current += files.length
    onBusyChange(true)

    const errors = []
    for (const [i, file] of files.entries()) {
      const { id } = pending[i]
      try {
        const item = await uploadFile(file, (progress) =>
          setUploads((list) => list.map((u) => (u.id === id ? { ...u, progress } : u))),
        )
        onChange((list) => [...list, item])
      } catch (err) {
        if (err.status === 401) ctx.handleError(err)
        errors.push(err.message)
      }
      setUploads((list) => list.filter((u) => u.id !== id))
      pendingCount.current -= 1
    }
    // Mientras quede algo subiendo (por ejemplo, otra tanda), no se puede guardar.
    if (!pendingCount.current) onBusyChange(false)
    setError(errors.join(' '))
  }

  const addLink = () => {
    const src = instagramUrl(link)
    if (!src) {
      setError('Ese link no es de una publicación o reel de Instagram. Copialo desde "Compartir" → "Copiar enlace".')
      return
    }
    if (items.some((item) => item.src === src)) {
      setError('Esa publicación ya está agregada.')
      return
    }
    onChange((list) => [...list, { type: 'instagram', src, label: '' }])
    setLink('')
    setError('')
  }

  return (
    <div className="pn-media">
      {items.length > 0 && (
        <ul className="pn-media__list">
          {items.map((item, i) => (
            <li key={item.src} className="pn-media__item">
              <a className="pn-media__thumb" href={item.src} target="_blank" rel="noreferrer" title="Abrir en otra pestaña">
                <Thumb item={item} />
              </a>
              <div className="pn-media__info">
                <span className="pn-media__type">{TYPE_LABELS[item.type]}</span>
                <input
                  value={item.label}
                  onChange={(e) => edit(i, { label: e.target.value })}
                  placeholder="Título (opcional), ej.: Entrevista"
                  aria-label={`Título de ${TYPE_LABELS[item.type].toLowerCase()} ${i + 1}`}
                  maxLength={80}
                />
              </div>
              <div className="pn-media__actions">
                <button type="button" className="pn-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir en el orden">
                  <Icon name="up" size={20} />
                </button>
                <button
                  type="button"
                  className="pn-icon-btn"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Bajar en el orden"
                >
                  <Icon name="down" size={20} />
                </button>
                <button type="button" className="pn-icon-btn" onClick={() => remove(i)} aria-label="Quitar">
                  <Icon name="trash" size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {uploads.length > 0 && (
        <ul className="pn-media__uploads" aria-live="polite">
          {uploads.map((u) => (
            <li key={u.id}>
              <span>{u.name}</span>
              <progress max="100" value={u.progress} aria-label={`Subiendo ${u.name}`} />
              <span>{u.progress}%</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pn-media__add">
        <button type="button" className="pn-btn" onClick={() => fileInput.current.click()}>
          <Icon name="upload" size={18} /> Subir fotos o videos
        </button>
        <input ref={fileInput} type="file" accept="image/*,video/*" multiple hidden onChange={onFiles} />
      </div>

      <div className="pn-media__link">
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addLink()
            }
          }}
          placeholder="Pegá el link de una publicación o reel de Instagram"
          aria-label="Link de Instagram"
        />
        <button type="button" className="pn-btn" onClick={addLink} disabled={!link.trim()}>
          <Icon name="instagram" size={18} /> Agregar
        </button>
      </div>

      {error && (
        <p className="pn-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
