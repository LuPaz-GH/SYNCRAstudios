// Íconos de línea simples, dibujados a mano para no depender de librerías externas.
const PATHS = {
  stage: 'M3 20h18M6 20V9l6-5 6 5v11M10 20v-5h4v5',
  hybrid: 'M3 5h12v9H3zM7 18h4M9 14v4M17 9h4v11h-4zM19 17h0',
  play: 'M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM10 8.5v7l6-3.5z',
  film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4',
  tv: 'M3 7h18v12H3zM8 3l4 4 4-4',
  doc: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.6 9h16.8M3.6 15h16.8M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  megaphone: 'M3 10v4h3l7 4V6L6 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  course: 'M2 8l10-5 10 5-10 5zM6 10v5c3 2.5 9 2.5 12 0v-5M22 8v6',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v2',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z',
  at: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  // Panel interno
  home: 'M3 11l9-7 9 7M5 9.5V20h5v-6h4v6h5V9.5',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  check: 'M4 5h16v16H4zM8 12.5l3 3 5-6',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M18 14a6 6 0 0 1 4 7',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  trash: 'M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  plus: 'M12 5v14M5 12h14',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  upload: 'M12 15V4M7 9l5-5 5 5M5 20h14',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 8.5h0',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.5 6.5h0',
  linkedin: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4',
  up: 'M6 15l6-6 6 6',
  down: 'M6 9l6 6 6-6',
  // Accesibilidad
  access: 'M12 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 8.5l8 1.5 8-1.5M12 10v4.5M12 14.5L8.5 21.5M12 14.5l3.5 7',
  contrast: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18',
  pause: 'M8 5v14M16 5v14',
  text: 'M4 19L9 5l5 14M5.8 14h6.4M15 19l3-8 3 8M15.9 16.5h4.2',
}

export default function Icon({ name, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
