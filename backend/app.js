import express from 'express'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error.middleware.js'

export const app = express()
app.disable('x-powered-by')

const api = express.Router()
api.use(express.json({ limit: '100kb' }))
api.use(routes)
api.use(errorHandler)

// En Netlify la API llega por /.netlify/functions/api; en local, por /api.
app.use(['/api', '/.netlify/functions/api'], api)
