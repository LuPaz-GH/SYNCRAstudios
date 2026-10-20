import { useCallback, useEffect, useMemo, useState } from 'react'
import Icon from '../../components/common/Icon'
import { api } from '../../services/api'
import { fullDate, localDay, when } from '../../utils/format'
import ItemForm from '../../components/panel/ItemForm'
import Pager from '../../components/panel/Pager'
import DateRange from '../../components/panel/DateRange'
import { exportToExcel } from '../../utils/exportExcel'

const PAGE_SIZE = 20

export default function ResourcePage({ name, config, ctx }) {
  const { isAdmin, notify, handleError } = ctx
  const [trash, setTrash] = useState(false)
  const [rows, setRows] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [editing, setEditing] = useState(null) // null = cerrado, {} = nuevo, fila = editar
  const [page, setPage] = useState(1)
  const [dates, setDates] = useState({ from: '', to: '' })
  // Qué fecha usa el filtro Desde/Hasta: la de cada sección (ej. Agenda: el día del evento) o la de creación.
  const dateFilter = config.dateFilter || { key: 'created_at', label: 'Creado' }

  const load = useCallback(() => {
    return api(`/${name}${trash ? '?papelera=1' : ''}`)
      .then(setRows)
      .catch(handleError)
  }, [name, trash, handleError])

  useEffect(() => {
    setRows(null)
    load()
  }, [load])

  const visible = useMemo(() => {
    if (!rows) return []
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (filter && config.filter && r[config.filter.key] !== filter) return false
      if (dates.from || dates.to) {
        const day = localDay(r[dateFilter.key])
        if (!day || (dates.from && day < dates.from) || (dates.to && day > dates.to)) return false
      }
      if (!q) return true
      return [config.title(r), config.subtitle?.(r), config.body?.(r)].join(' ').toLowerCase().includes(q)
    })
  }, [rows, search, filter, dates, dateFilter.key, config])

  // Al buscar, filtrar o cambiar de pestaña se vuelve a la primera página.
  useEffect(() => setPage(1), [search, filter, dates, trash, name])

  // De a 20 por página. Si se borra lo último de una página, se muestra la anterior.
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const pageRows = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const goTo = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const restore = async (row) => {
    try {
      await api(`/${name}/${row.id}/restaurar`, { method: 'POST' })
      notify(`Se restauró "${config.title(row)}".`)
      load()
    } catch (err) {
      handleError(err)
    }
  }

  const remove = async (row) => {
    try {
      await api(`/${name}/${row.id}`, { method: 'DELETE' })
      notify(`"${config.title(row)}" se mandó a la papelera.`, {
        action: { label: 'Deshacer', run: () => restore(row) },
      })
      load()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaved = (isNew) => {
    setEditing(null)
    notify(isNew ? 'Se creó correctamente.' : 'Cambios guardados.')
    load()
  }

  return (
    <section className="pn-page">
      <header className="pn-page__head">
        <div>
          <h1>{trash ? `Papelera · ${config.label}` : config.label}</h1>
          <p>
            {trash
              ? isAdmin
                ? 'Todo lo que se borró. Podés restaurar cualquier cosa.'
                : 'Lo que borraste vos. Si necesitás recuperar algo que borró otra persona, pedíselo al administrador.'
              : config.intro}
          </p>
        </div>
        {!trash && (
          <div className="pn-page__actions">
            <button
              className="pn-btn"
              onClick={() => exportToExcel(name, config, visible)}
              disabled={!visible.length}
              title="Descarga la lista que estás viendo (con los filtros aplicados)"
            >
              <Icon name="download" size={18} /> Descargar Excel
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => setEditing({})}>
              <Icon name="plus" size={18} /> {config.newLabel}
            </button>
          </div>
        )}
      </header>

      <div className="pn-toolbar">
        <div className="pn-tabs" role="tablist">
          <button role="tab" aria-selected={!trash} className={!trash ? 'is-active' : ''} onClick={() => setTrash(false)}>
            Activos
          </button>
          <button role="tab" aria-selected={trash} className={trash ? 'is-active' : ''} onClick={() => setTrash(true)}>
            <Icon name="trash" size={16} /> Papelera
          </button>
        </div>
        <label className="pn-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Buscar…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Buscar en ${config.label.toLowerCase()}`}
          />
        </label>
        {config.filter && (
          <select
            className="pn-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label={`Filtrar por ${config.filter.label.toLowerCase()}`}
          >
            <option value="">{config.filter.label}: todos</option>
            {config.filter.options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
        <DateRange value={dates} onChange={setDates} label={dateFilter.label} />
      </div>

      {rows === null ? (
        <p className="pn-empty">Cargando…</p>
      ) : visible.length === 0 ? (
        <p className="pn-empty">
          {rows.length === 0
            ? trash
              ? 'La papelera está vacía.'
              : `Todavía no hay ${config.label.toLowerCase()}.`
            : 'No hay resultados con ese filtro.'}
        </p>
      ) : (
        <ul className="pn-list">
          {pageRows.map((row) => {
            const badge = config.badge?.(row)
            const body = config.body?.(row)
            const subtitle = config.subtitle?.(row)
            const link = !trash && config.link?.(row)
            return (
              <li key={row.id} className="pn-item">
                <div className="pn-item__main">
                  <div className="pn-item__title">
                    <h2>{config.title(row)}</h2>
                    {badge && <span className={`pn-badge pn-badge--${badge.tone}`}>{badge.text}</span>}
                  </div>
                  {subtitle && <p className="pn-item__sub">{subtitle}</p>}
                  {body && <p className="pn-item__body">{body}</p>}
                  <p className="pn-item__meta">
                    {trash ? (
                      <span title={fullDate(row.deleted_at)}>
                        Borrado por <strong>{row.deleted_by_name || 'alguien'}</strong> {when(row.deleted_at)}
                      </span>
                    ) : (
                      <>
                        <span title={fullDate(row.created_at)}>
                          Creado {row.created_by_name ? <>por <strong>{row.created_by_name}</strong> </> : 'desde la web '}
                          {when(row.created_at)}
                        </span>
                        {row.updated_by_name && row.updated_at > row.created_at && (
                          <span title={fullDate(row.updated_at)}>
                            Editado por <strong>{row.updated_by_name}</strong> {when(row.updated_at)}
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="pn-item__actions">
                  {trash ? (
                    <button className="pn-btn" onClick={() => restore(row)}>
                      <Icon name="undo" size={18} /> Restaurar
                    </button>
                  ) : (
                    <>
                      {link && (
                        <a className="pn-btn" href={link.href}>
                          <Icon name={link.icon} size={18} /> {link.label}
                        </a>
                      )}
                      <button className="pn-btn" onClick={() => setEditing(row)}>
                        <Icon name="edit" size={18} /> Editar
                      </button>
                      {!(name === 'usuarios' && row.id === ctx.user.id) && (
                        <button className="pn-btn pn-btn--danger" onClick={() => remove(row)}>
                          <Icon name="trash" size={18} /> Borrar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Pager page={current} pages={pages} total={visible.length} onChange={goTo} />

      {editing && (
        <ItemForm
          name={name}
          config={config}
          row={editing.id ? editing : null}
          ctx={ctx}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </section>
  )
}
