import { Router } from 'express'
import { list, create, update, remove, restore, purge } from '../controllers/resources.controller.js'

// Mismas rutas para cada sección: /mensajes, /eventos, /tareas, /usuarios.
// Los permisos de cada una se revisan en services/resources.service.js.
const router = Router()

router.get('/:resource', list)
router.post('/:resource', create)
router.put('/:resource/:id', update)
router.delete('/:resource/:id', remove) // borrado lógico: va a la papelera
router.post('/:resource/:id/restaurar', restore)
router.delete('/:resource/:id/definitivo', purge) // borrado real, solo administrador y desde la papelera

export default router
