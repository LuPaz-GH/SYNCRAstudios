import * as resourcesService from '../services/resources.service.js'

// Sirve para todas las secciones del panel: mensajes, eventos, tareas y usuarios.

export async function list(req, res) {
  res.json(await resourcesService.list(req.params.resource, req.user, { trash: req.query.papelera === '1' }))
}

export async function create(req, res) {
  res.status(201).json(await resourcesService.create(req.params.resource, req.user, req.body || {}))
}

export async function update(req, res) {
  res.json(await resourcesService.update(req.params.resource, req.user, req.params.id, req.body || {}))
}

export async function remove(req, res) {
  await resourcesService.remove(req.params.resource, req.user, req.params.id)
  res.json({ ok: true })
}

export async function purge(req, res) {
  await resourcesService.purge(req.params.resource, req.user, req.params.id)
  res.json({ ok: true })
}

export async function restore(req, res) {
  await resourcesService.restore(req.params.resource, req.user, req.params.id)
  res.json({ ok: true })
}
