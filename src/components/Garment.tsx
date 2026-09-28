import type { CategoryId } from '../data/types'

/**
 * 카테고리별 의류 실루엣. 실제 상품 사진이 들어오기 전까지
 * 썸네일이 비어 보이지 않게 채우는 용도다.
 */
const shapes: Record<CategoryId, string> = {
  tee: 'M35 18 L28 22 L18 32 L26 41 L31 35 L31 83 L69 83 L69 35 L74 41 L82 32 L72 22 L65 18 C62 25 38 25 35 18 Z',
  knit: 'M35 18 L26 22 L14 41 L14 67 L24 69 L26 47 L31 45 L31 85 L69 85 L69 45 L74 47 L76 69 L86 67 L86 41 L74 22 L65 18 C62 25 38 25 35 18 Z',
  outer:
    'M34 17 L25 22 L13 43 L13 69 L23 71 L25 49 L30 47 L30 87 L47 87 L47 34 L50 26 L53 34 L53 87 L70 87 L70 47 L75 49 L77 71 L87 69 L87 43 L75 22 L66 17 L50 31 Z',
  track:
    'M35 17 L26 22 L14 42 L14 68 L24 70 L26 48 L31 46 L31 86 L47 86 L47 30 L50 24 L53 30 L53 86 L69 86 L69 46 L74 48 L76 70 L86 68 L86 42 L74 22 L65 17 L50 28 Z',
  shirt:
    'M36 16 L27 21 L15 39 L15 65 L25 67 L27 45 L32 43 L32 86 L68 86 L68 43 L73 45 L75 67 L85 65 L85 39 L73 21 L64 16 L50 29 Z',
  denim: 'M32 15 L68 15 L70 41 L66 88 L54 88 L50 52 L46 88 L34 88 L30 41 Z',
  dress:
    'M36 18 L28 22 L18 34 L26 43 L31 36 L28 57 L21 89 L79 89 L72 57 L69 36 L74 43 L82 34 L72 22 L64 18 C61 25 39 25 36 18 Z',
  acc: 'M22 60 C22 36 35 24 50 24 C65 24 78 36 78 60 Z M15 60 H89 V69 H15 Z',
}

export function Garment({
  category,
  className,
}: {
  category: CategoryId
  className?: string
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={shapes[category]} fill="currentColor" />
    </svg>
  )
}
