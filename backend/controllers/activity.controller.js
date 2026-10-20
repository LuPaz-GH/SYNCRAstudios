import { activity } from '../services/audit.service.js'
import { undo } from '../services/resources.service.js'

export async function getActivity(req, res) {
  res.json(
    await activity(req.user, {
      userId: req.query.usuario,
      entity: req.query.seccion,
      action: req.query.accion,
      search: req.query.buscar,
      from: req.query.desde,
      to: req.query.hasta,
      page: req.query.pagina,
    }),
  )
}

export async function undoEntry(req, res) {
  await undo(req.user, req.params.id)
  res.json({ ok: true })
}
