import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller.js'
import { requireUser } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/me', requireUser, me)

export default router
