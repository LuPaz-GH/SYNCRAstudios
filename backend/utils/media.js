import { HttpError } from './HttpError.js'

// Fotos, videos y publicaciones de Instagram de un evento.
// Cada uno es { type: 'video' | 'image' | 'instagram', src, label }; los de Instagram pueden tener "cover" (portada).
// Los eventos viejos no tienen "type": son videos.

const MAX_ITEMS = 30
const TYPES = ['video', 'image', 'instagram']

// Link de una publicación o reel de Instagram → link limpio (sin ?igsh=… ni nada extra).
export function instagramUrl(value) {
  const match = String(value || '')
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:(?!share\/)[\w.]+\/)?(p|reels?|tv)\/([\w-]{5,40})/i)
  if (!match) return null
  const kind = match[1].toLowerCase() === 'p' ? 'p' : match[1].toLowerCase() === 'tv' ? 'tv' : 'reel'
  return `https://www.instagram.com/${kind}/${match[2]}/`
}

// Archivo propio: subido a Cloudinary o guardado dentro de la web (ej. /videos/expocom.mp4).
function isOwnFile(src) {
  if (/^\/[\w/.-]+$/.test(src) && !src.includes('..')) return true
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const host = cloud ? `res\\.cloudinary\\.com/${cloud.replace(/[^\w-]/g, '')}` : 'res\\.cloudinary\\.com/[\\w-]+'
  return new RegExp(`^https://${host}/(image|video)/upload/[\\w/.,-]+$`).test(src)
}

export function cleanMedia(value) {
  if (value == null || value === '') return null
  if (!Array.isArray(value)) throw new HttpError(400, 'La lista de fotos y videos no es válida.')
  if (value.length > MAX_ITEMS) throw new HttpError(400, `Se pueden cargar hasta ${MAX_ITEMS} fotos y videos por evento.`)

  const list = value.map((item) => {
    const type = TYPES.includes(item?.type) ? item.type : 'video'
    const label = String(item?.label || '').trim().slice(0, 80)
    let src = String(item?.src || '').trim()
    if (type === 'instagram') {
      src = instagramUrl(src)
      if (!src) throw new HttpError(400, 'Hay un link de Instagram que no es de una publicación o reel.')
      // Portada opcional: una foto subida desde el panel que se muestra como miniatura.
      const cover = String(item?.cover || '').trim()
      if (!cover) return { type, src, label }
      if (!isOwnFile(cover)) throw new HttpError(400, 'La portada de Instagram no es un archivo válido.')
      return { type, src, label, cover }
    }
    if (!isOwnFile(src)) throw new HttpError(400, `"${src.slice(0, 60)}" no es un archivo válido.`)
    return { type, src, label }
  })
  return list.length ? list : null
}
