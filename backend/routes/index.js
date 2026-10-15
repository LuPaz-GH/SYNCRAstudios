import { Router } from 'express'
import { requireUser } from '../middleware/auth.middleware.js'
import publicRoutes from './public.routes.js'
import authRoutes from './auth.routes.js'
import panelRoutes from './panel.routes.js'
import activityRoutes from './activity.routes.js'
import mediaRoutes from './media.routes.js'
import resourcesRoutes from './resources.routes.js'

const router = Router()

// Sin sesión
router.use('/public', publicRoutes)
router.use('/auth', authRoutes)

// Con sesión (todo lo que sigue)
router.use(requireUser)
router.use(panelRoutes)
router.use('/actividad', activityRoutes)
router.use('/media', mediaRoutes)
router.use(resourcesRoutes) // va última: captura /:resource

export default router
