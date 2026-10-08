import { Suspense, lazy } from 'react'
import HomePage from '../pages/HomePage'

// El panel interno vive en /panel y se descarga aparte, así no pesa en la web pública.
// Las secciones de adentro del panel (/panel/eventos, /panel/tareas…) las maneja PanelPage.
const PanelPage = lazy(() => import('../pages/panel/PanelPage'))

const isPanelPath = (path) => path === '/panel' || path.startsWith('/panel/')

export default function AppRouter() {
  if (isPanelPath(window.location.pathname)) {
    return (
      <Suspense fallback={null}>
        <PanelPage />
      </Suspense>
    )
  }
  return <HomePage />
}
