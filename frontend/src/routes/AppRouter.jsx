import { Suspense, lazy } from 'react'
import HomePage from '../pages/HomePage'
import PrivacyPage from '../pages/PrivacyPage'
import NotFoundPage from '../pages/NotFoundPage'

// El panel interno vive en /panel y se descarga aparte, así no pesa en la web pública.
// Las secciones de adentro del panel (/panel/eventos, /panel/tareas…) las maneja PanelPage.
const PanelPage = lazy(() => import('../pages/panel/PanelPage'))

const isPanelPath = (path) => path === '/panel' || path.startsWith('/panel/')

export default function AppRouter() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (isPanelPath(path)) {
    return (
      <Suspense fallback={null}>
        <PanelPage />
      </Suspense>
    )
  }
  if (path === '/' || path === '/index.html') return <HomePage />
  if (path === '/privacidad') return <PrivacyPage />
  return <NotFoundPage />
}
