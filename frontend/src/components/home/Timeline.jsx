// Línea de tiempo de edición: un cabezal recorre la pista de audio y los bloques de subtítulos.
const BLOCKS = [
  { left: 2, width: 22, text: 'Porque acá, en Tafí Viejo…' },
  { left: 27, width: 17, text: '(Viento)' },
  { left: 47, width: 27, text: '…las historias son otra cosa.' },
  { left: 77, width: 21, text: '♪ Música suave ♪' },
]

const WAVE = Array.from({ length: 70 }, (_, i) => 18 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 82)

export default function Timeline() {
  return (
    <div className="timeline" aria-hidden="true">
      <div className="timeline__ruler">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>00:0{i}:00</span>
        ))}
      </div>
      <div className="timeline__track timeline__track--audio">
        {WAVE.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="timeline__track timeline__track--subs">
        {BLOCKS.map((b, i) => (
          <span key={i} className="timeline__block" style={{ left: `${b.left}%`, width: `${b.width}%` }}>
            {b.text}
          </span>
        ))}
      </div>
      <span className="timeline__playhead" />
    </div>
  )
}
