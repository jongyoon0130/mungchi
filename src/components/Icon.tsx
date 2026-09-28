export type IconName =
  | 'shield'
  | 'truck'
  | 'doc'
  | 'cursor'
  | 'star'
  | 'check'
  | 'arrow'
  | 'search'
  | 'chevron'
  | 'menu'
  | 'close'
  | 'box'
  | 'tag'
  | 'clock'
  | 'gavel'
  | 'camera'
  | 'copy'
  | 'plus'
  | 'mail'
  | 'play'
  | 'heart'
  | 'cart'
  | 'store'
  | 'video'

const paths: Record<IconName, string> = {
  shield: 'M12 3l7 3v5.5c0 4.3-2.9 7.9-7 9-4.1-1.1-7-4.7-7-9V6l7-3z',
  truck:
    'M3 7h10v9H3zM13 10h4l3 3v3h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z',
  doc: 'M6 3h7l5 5v13H6zM13 3v5h5',
  cursor: 'M5 3l14 7-6 1.6L9.6 18z',
  star: 'M12 3l2.8 5.9 6.2.8-4.6 4.4 1.2 6.4L12 17.4 6.4 20.5l1.2-6.4L3 9.7l6.2-.8z',
  check: 'M4 12.5l5 5L20 6.5',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16.5 16.5L21 21',
  chevron: 'M9 5l7 7-7 7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  box: 'M3 8l9-4 9 4-9 4zM3 8v8l9 4 9-4V8M12 12v8',
  tag: 'M4 12.5V4h8.5L21 12.5 12.5 21zM8 8h.01',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5V12l3.5 2',
  gavel:
    'M11 5l5 5M8.5 7.5l5 5M13.5 2.5l8 8M3 21h9M6 18l7-7',
  camera:
    'M3 8.5h3l1.5-2.5h9L18 8.5h3v11H3zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  copy: 'M9 9h11v11H9zM15 9V4H4v11h5',
  plus: 'M12 5v14M5 12h14',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  play: 'M8 5l11 7-11 7z',
  heart:
    'M12 20s-7-4.4-7-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 017 3.5c0 5.1-7 9.5-7 9.5z',
  cart: 'M3 5h2.5l2 10h10l2-7H7M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  store: 'M4 9h16v11H4zM3 9l2-5h14l2 5M10 20v-6h4v6',
  video: 'M3 6h11v12H3zM14 10l7-3.5v11L14 14z',
}

const filled: IconName[] = ['star', 'cursor', 'play']

export function Icon({
  name,
  className = 'size-5',
  strokeWidth = 1.7,
}: {
  name: IconName
  className?: string
  strokeWidth?: number
}) {
  const isFilled = filled.includes(name)
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
