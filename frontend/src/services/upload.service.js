import { api } from './api'

// Sube una foto o un video directo a Cloudinary, con el permiso que firma nuestro servidor.
// Límites del plan gratis de Cloudinary: fotos hasta 10 MB y videos hasta 100 MB.
const MB = 1024 * 1024
const LIMITS = { image: 10 * MB, video: 100 * MB }

export async function uploadFile(file, onProgress) {
  const kind = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : null
  if (!kind) throw new Error(`"${file.name}" no es una foto ni un video.`)
  if (file.size > LIMITS[kind]) {
    throw new Error(
      kind === 'video'
        ? `"${file.name}" pesa más de 100 MB. Comprimilo (por ejemplo con HandBrake) o subilo a Instagram y pegá el link.`
        : `"${file.name}" pesa más de 10 MB. Probá con una versión más liviana.`,
    )
  }

  const { cloudName, apiKey, ...signed } = await api('/media/firma', { method: 'POST', body: { kind } })
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', apiKey)
  for (const [key, value] of Object.entries(signed)) form.append(key, value)

  // XMLHttpRequest (y no fetch) para poder mostrar el porcentaje de avance.
  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      let data = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        // respuesta vacía o rara: se informa abajo
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else reject(new Error(`No se pudo subir "${file.name}". ${data.error?.message || ''}`.trim()))
    }
    xhr.onerror = () => reject(new Error(`No se pudo subir "${file.name}". Revisá la conexión.`))
    xhr.send(form)
  })

  // Los videos se guardan apuntando a la versión MP4 que Cloudinary prepara al subirlos ("eager").
  let src = result.secure_url
  if (signed.eager) {
    const [steps, ext] = signed.eager.split('/')
    src = src.replace('/upload/', `/upload/${steps}/`).replace(/\.\w+$/, `.${ext}`)
  }
  return { type: kind, src, label: '' }
}
