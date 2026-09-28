// Eventos en los que participó SYNCRA.
// Para sumar uno, copiá un bloque { ... } y completalo. Los campos marcados como opcionales se pueden borrar.
// El primer evento de la lista es el destacado (se muestra grande, con video si tiene).
export const EVENTS = [
  {
    name: 'Expocom',
    kind: 'Presentación', // ej.: Congreso, Conferencia, Streaming, Entrevista
    date: '', // opcional, ej.: 'Septiembre 2026'
    place: '', // opcional, ej.: 'San Miguel de Tucumán'
    // opcional: videos dentro de public/videos. El primero se muestra más grande.
    videos: [
      { src: '/videos/expocom-presentacion.mp4', label: 'Presentación' },
      { src: '/videos/expocom-entrevista.mp4', label: 'Entrevista' },
    ],
    text: 'En Expocom presentamos SYNCRA Studios: subtitulado en vivo con precisión humana, para que cada palabra llegue a todo el público. Mirá la presentación y la entrevista.',
  },
  // {
  //   name: 'Nombre del evento',
  //   kind: 'Congreso',
  //   date: 'Mayo 2026',
  //   place: 'Ciudad',
  //   text: 'Qué hicimos: subtitulado en vivo para 500 asistentes y la transmisión por YouTube.',
  // },
]
