// Arranca la API en tu compu: npm run api
import { app } from './app.js'

const port = Number(process.env.API_PORT || 3001)
app.listen(port, () => console.log(`API de SYNCRA lista en http://localhost:${port}/api`))
