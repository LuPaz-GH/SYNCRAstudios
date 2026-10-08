// Error con código HTTP: lo lanzan los servicios y lo responde el middleware de errores.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
