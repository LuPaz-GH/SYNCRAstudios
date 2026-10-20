import * as publicService from '../services/public.service.js'

export async function getEvents(req, res) {
  res.json(await publicService.listEvents())
}

export async function getUpcoming(req, res) {
  res.json(await publicService.listUpcoming())
}

export async function postMessage(req, res) {
  const body = req.body || {}
  if (body.website) return res.json({ ok: true }) // campo trampa: solo lo completan los bots
  await publicService.saveContactMessage(body)
  res.json({ ok: true })
}
