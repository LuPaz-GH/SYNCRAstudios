import { useCallback, useEffect, useState } from 'react'
import Icon from '../../components/common/Icon'
import ActivityList from '../../components/panel/ActivityList'
import DateRange from '../../components/panel/DateRange'
import { api } from '../../services/api'
import { dayRangeToUtc } from '../../utils/format'
import { ACTION_LABELS, ENTITY_LABELS } from '../../utils/panelConfig'

export default function ActivityPage({ ctx }) {
  const { isAdmin, handleError } = ctx
  const [filters, setFilters] = useState({ usuario: '', seccion: '', accion: '' })
  const [entries, setEntries] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [team, setTeam] = useState([])
  const [dates, setDates] = useState({ from: '', to: '' })
  const [search, setSearch] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isAdmin) api('/equipo').then(setTeam).catch(handleError)
  }, [isAdmin, handleError])

  // El buscador pregunta al servidor cuando se deja de escribir (no con cada letra).
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(search.trim()), 400)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(
    (pageToLoad) => {
      const params = new URLSearchParams({ ...filters, ...dayRangeToUtc(dates), buscar: searchQuery, pagina: pageToLoad })
      return api(`/actividad?${params}`)
        .then((data) => {
          setEntries((prev) => (pageToLoad === 1 ? data.rows : [...(prev || []), ...data.rows]))
          setHasMore(data.hasMore)
          setPage(pageToLoad)
        })
        .catch(handleError)
    },
    [filters, dates, searchQuery, handleError],
  )

  useEffect(() => {
    load(1)
  }, [load])

  const setFilter = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  return (
    <section className="pn-page">
      <header className="pn-page__head">
        <div>
          <h1>{isAdmin ? 'Actividad del equipo' : 'Mi actividad'}</h1>
          <p>
            {isAdmin
              ? 'Todo lo que se creó, editó, borró o restauró, con quién lo hizo y cuándo. Podés deshacer ediciones y restaurar lo borrado.'
              : 'Lo que hiciste en el panel. Para recuperar algo que borraste, entrá a la papelera de cada sección.'}
          </p>
        </div>
      </header>

      <div className="pn-toolbar">
        <label className="pn-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar en la actividad"
          />
        </label>
        {isAdmin && (
          <select className="pn-select" value={filters.usuario} onChange={setFilter('usuario')} aria-label="Filtrar por persona">
            <option value="">Todas las personas</option>
            {team.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        )}
        <select className="pn-select" value={filters.seccion} onChange={setFilter('seccion')} aria-label="Filtrar por sección">
          <option value="">Todas las secciones</option>
          {Object.entries(ENTITY_LABELS)
            .filter(([key]) => isAdmin || key !== 'usuarios')
            .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
        </select>
        <select className="pn-select" value={filters.accion} onChange={setFilter('accion')} aria-label="Filtrar por acción">
          <option value="">Todas las acciones</option>
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <DateRange value={dates} onChange={setDates} />
      </div>

      {entries === null ? (
        <p className="pn-empty">Cargando…</p>
      ) : entries.length === 0 ? (
        <p className="pn-empty">No hay movimientos con ese filtro.</p>
      ) : (
        <>
          <ActivityList entries={entries} ctx={ctx} onChange={() => load(1)} />
          {hasMore && (
            <button className="pn-btn pn-more" onClick={() => load(page + 1)}>
              Ver más
            </button>
          )}
        </>
      )}
    </section>
  )
}
