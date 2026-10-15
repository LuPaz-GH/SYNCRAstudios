// Fotos, videos y publicaciones de Instagram de un evento: { type, src, label }.
// Los eventos viejos no tienen "type": son videos.
export const normalizeMedia = (list) => (list || []).map((item) => ({ ...item, type: item.type || 'video' }))

// Link de una publicación o reel de Instagram → link limpio (el servidor hace lo mismo).
export function instagramUrl(value) {
  const match = String(value || '')
    .trim()
    .match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:(?!share\/)[\w.]+\/)?(p|reels?|tv)\/([\w-]{5,40})/i)
  if (!match) return null
  const kind = match[1].toLowerCase() === 'p' ? 'p' : match[1].toLowerCase() === 'tv' ? 'tv' : 'reel'
  return `https://www.instagram.com/${kind}/${match[2]}/`
}

export const instagramEmbed = (src) => `${src}embed/`

// Fotos de Cloudinary: se piden achicadas y comprimidas al tamaño que hace falta.
// (Los videos ya quedan comprimidos al subirlos: ver services/upload.service.js.)
export const imageUrl = (src, width = 1600) =>
  src.startsWith('https://res.cloudinary.com/') ? src.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`) : src
