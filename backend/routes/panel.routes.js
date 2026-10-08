import { Router } from 'express'
import { getSummary, getTeam } from '../controllers/panel.controller.js'

const router = Router()

router.get('/resumen', getSummary)
router.get('/equipo', getTeam)

export default router
