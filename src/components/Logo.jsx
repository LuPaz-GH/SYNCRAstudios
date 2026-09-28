// Isologo de SYNCRA: la "S" se dibuja al cargar y la barra amarilla parpadea como un cursor de subtítulo.
export default function Logo({ size = 44, withText = true, className = '' }) {
  return (
    <span className={`logo ${className}`}>
      <svg className="logo__mark" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
        <path
          className="logo__s"
          d="M94 20 H46 A22 22 0 0 0 46 64 H74 A22 22 0 0 1 74 108 H26"
          pathLength="1"
        />
        <g className="logo__dots">
          <circle cx="52" cy="64" r="2.6" />
          <circle cx="60" cy="64" r="2.6" />
          <circle cx="68" cy="64" r="2.6" />
        </g>
        <rect className="logo__cursor" x="66" y="28" width="10" height="17" rx="5" />
        <circle className="logo__dot" cx="71" cy="52" r="3.4" />
      </svg>
      {withText && (
        <span className="logo__text">
          <span className="logo__name">SYNCRA</span>
          <span className="logo__sub">STUDIOS</span>
        </span>
      )}
    </span>
  )
}
