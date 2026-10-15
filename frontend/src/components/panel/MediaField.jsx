import { useRef, useState } from 'react'
import Icon from '../common/Icon'
import { uploadFile } from '../../services/upload.service'
import { imageUrl, instagramUrl } from '../../utils/media'

const TYPE_LABELS = { image: 'Foto', video: 'Video', instagram: 'Instagram' }

function Thumb({ item }) {
  if (item.type === 'image') return <img src={imageUrl(item.src, 160)} alt="" loading="lazy" />
  if (item.type === 'video') return <video src={item.src} preload="metadata" muted playsInline />
  if (item.cover) return <img src={imageUrl(item.cover, 160)} alt="" loading="lazy" />
  return <Icon name="instagram" />
}

// Fotos, videos y publicaciones de Instagram de un evento.
// "onChange" recibe una función (lista anterior → lista nueva), porque las subidas terminan de a una.
export default function MediaField({ value, onChange, onBusyChange, ctx }) {
  const fileInput = useRef(null)
  const coverInput = useRef(null)
  const coverFor = useRef(null) // link de Instagram al que se le está eligiendo portada
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

  // Sube los archivos de a uno, mostrando el avance. "onUploaded" recibe cada archivo ya subido.
  const uploadAll = async (files, onUploaded) => {
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
        onUploaded(item)
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

  const onFiles = (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (files.length) uploadAll(files, (item) => onChange((list) => [...list, item]))
  }

  const chooseCover = (src) => {
    coverFor.current = src
    coverInput.current.click()
  }

  const onCover = (e) => {
    const [file] = e.target.files
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('La portada tiene que ser una foto (por ejemplo, una captura del video).')
      return
    }
    const src = coverFor.current
    uploadAll([file], (cover) => onChange((list) => list.map((item) => (item.src === src ? { ...item, cover: cover.src } : item))))
  }

  const addLink = (value = link) => {
    const src = instagramUrl(value)
    if (!src) {
      setError(
        /instagram\.com\/share\//i.test(value)
          ? 'Ese es un link corto de "compartir". Abrilo en el navegador, esperá que cargue la publicación y copiá la dirección de arriba.'
          : 'Ese link no es de una publicación o reel de Instagram. En Instagram tocá "Compartir" → "Copiar enlace".',
      )
      return
    }
    if (items.some((item) => item.src === src)) {
      setError('Esa publicación ya está agregada.')
      setLink('')
      return
    }
    onChange((list) => [...list, { type: 'instagram', src, label: '' }])
    setLink('')
    setError('')
  }

  // Al pegar un link válido se agrega solo, sin tener que tocar "Agregar".
  const onLinkPaste = (e) => {
    const value = e.clipboardData.getData('text')
    if (!instagramUrl(value)) return
    e.preventDefault()
    addLink(value)
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
                {item.type === 'instagram' && (
                  <button type="button" className="pn-link pn-media__cover" onClick={() => chooseCover(item.src)}>
                    <Icon name="image" size={16} /> {item.cover ? 'Cambiar portada' : 'Elegir portada (una captura del video)'}
                  </button>
                )}
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
        <input ref={coverInput} type="file" accept="image/*" hidden onChange={onCover} />
      </div>

      <div className="pn-media__link">
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onPaste={onLinkPaste}
          onBlur={() => instagramUrl(link) && addLink()} // si quedó escrito y se toca "Guardar", no se pierde
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addLink()
            }
          }}
          placeholder="Pegá el link de una publicación o reel de Instagram"
          aria-label="Link de Instagram"
        />
        <button type="button" className="pn-btn" onClick={() => addLink()} disabled={!link.trim()}>
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
