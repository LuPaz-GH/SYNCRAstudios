import { Router } from 'express'
import { getActivity, undoEntry } from '../controllers/activity.controller.js'
import { requireAdmin } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', getActivity)
router.post('/:id/deshacer', requireAdmin, undoEntry)

export default router
