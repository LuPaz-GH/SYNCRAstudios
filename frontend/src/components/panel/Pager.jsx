import Icon from '../common/Icon'

// Botones "Anterior" y "Siguiente" para las listas largas del panel.
export default function Pager({ page, pages, total, onChange }) {
  if (pages <= 1) return null
  return (
    <nav className="pn-pager" aria-label="Páginas">
      <button type="button" className="pn-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>
        <Icon name="arrow" size={18} /> Anterior
      </button>
      <p aria-live="polite">
        Página <strong>{page}</strong> de {pages} <span>· {total} en total</span>
      </p>
      <button type="button" className="pn-btn" onClick={() => onChange(page + 1)} disabled={page === pages}>
        Siguiente <Icon name="arrow" size={18} />
      </button>
    </nav>
  )
}
