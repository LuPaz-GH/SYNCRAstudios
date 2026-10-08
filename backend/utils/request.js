// IP real de quien hace el pedido. En Netlify viene en un encabezado propio que no se puede falsear.
export function clientIp(req) {
  return req.headers['x-nf-client-connection-ip'] || req.socket.remoteAddress
}

export function readCookie(req, name) {
  const header = req.headers.cookie || ''
  for (const part of header.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return null
}
