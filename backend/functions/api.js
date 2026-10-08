// La misma API, publicada como función de Netlify.
import serverless from 'serverless-http'
import { app } from '../app.js'

export const handler = serverless(app)
