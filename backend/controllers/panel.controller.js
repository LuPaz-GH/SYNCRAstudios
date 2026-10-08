import * as panelService from '../services/panel.service.js'

export async function getSummary(req, res) {
  res.json(await panelService.summary(req.user.id))
}

export async function getTeam(req, res) {
  res.json(await panelService.team())
}
