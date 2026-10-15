import * as mediaService from '../services/media.service.js'

export function getUploadSignature(req, res) {
  res.json(mediaService.uploadSignature(req.body?.kind))
}
