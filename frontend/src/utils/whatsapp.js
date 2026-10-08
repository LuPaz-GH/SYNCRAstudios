// Número de WhatsApp de SYNCRA (código de país + área + número, sin espacios ni "+").
export const WHATSAPP_PHONE = '5493814480873'
export const WHATSAPP_DISPLAY = '+54 9 381 448-0873'

// Link que abre una conversación con el mensaje ya escrito.
export function whatsappLink(text = '') {
  return `https://wa.me/${WHATSAPP_PHONE}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
