import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Raíz del proyecto (donde están package.json y .env).
const projectRoot = fileURLToPath(new URL('..', import.meta.url))

// En tu compu, "npm run dev" levanta también la API del panel (no hace falta otra terminal).
function panelApi() {
  return {
    name: 'syncra-panel-api',
    apply: 'serve',
    async configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, projectRoot, ''))
      const { app } = await import('../backend/app.js')
      server.middlewares.use((req, res, next) => (req.url.startsWith('/api/') ? app(req, res, next) : next()))
    },
  }
}

export default defineConfig({
  plugins: [react(), panelApi()],
  // La versión final se genera en /dist (en la raíz), que es lo que publica Netlify.
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
