import type { CategoryId, Lot } from '../data/types'
import { Garment } from './Garment'

/** 빈티지 의류에서 실제로 많이 보이는 색을 골라 둔 팔레트 */
const tones: { panel: string; ink: string }[] = [
  { panel: '#C9A882', ink: '#6B4A2A' },
  { panel: '#7C90A8', ink: '#2F4257' },
  { panel: '#BE7A41', ink: '#6B3D12' },
  { panel: '#8FA07C', ink: '#43513A' },
  { panel: '#C2A2AA', ink: '#6B4752' },
  { panel: '#A8968C', ink: '#524339' },
  { panel: '#D3BE93', ink: '#6E5A2C' },
  { panel: '#7F9A94', ink: '#33504B' },
  { panel: '#B26B62', ink: '#63302A' },
  { panel: '#C4B2C0', ink: '#5B4757' },
  { panel: '#6F7F97', ink: '#2B3A4D' },
  { panel: '#C9968C', ink: '#6B3B32' },
]

/** 같은 묶음은 항상 같은 색이 나오도록 id에서 색을 뽑는다 */
function toneFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973
  }
  return tones[hash % tones.length]
}

/**
 * 묶음 썸네일. 사진이 있으면 사진을, 없으면 카테고리 실루엣을 보여준다.
 * 사진을 아직 안 올린 묶음도 목록에서 깨져 보이지 않게 하려는 장치다.
 */
export function Thumb({
  lot,
  index = 0,
  className = '',
}: {
  lot: Lot
  /** 몇 번째 사진을 보여줄지. 상세 페이지 갤러리에서 쓴다 */
  index?: number
  className?: string
}) {
  const photo = lot.photos[index]

  if (photo) {
    return (
      <img
        src={photo}
        alt={lot.title}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <GarmentPanel
      category={lot.category}
      seed={lot.id + index}
      className={className}
    />
  )
}

export function GarmentPanel({
  category,
  seed,
  className = '',
}: {
  category: CategoryId
  seed: string
  className?: string
}) {
  const tone = toneFor(seed)

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: tone.panel, color: tone.ink }}
    >
      {/* 사선 텍스처 — 단색 패널이 심심해 보이지 않게 */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${tone.ink} 0 1px, transparent 1px 9px)`,
        }}
      />
      <Garment category={category} className="relative w-[56%] opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent to-[55%]" />
    </div>
  )
}
