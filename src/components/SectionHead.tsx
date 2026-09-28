import { Link } from 'react-router-dom'
import { Icon } from './Icon'

export function SectionHead({
  eyebrow,
  title,
  body,
  moreTo,
  moreLabel = '전체 보기',
  center = false,
}: {
  eyebrow?: string
  title: string
  body?: string
  moreTo?: string
  moreLabel?: string
  center?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        center ? 'sm:flex-col sm:items-center sm:text-center' : ''
      }`}
    >
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-2.5 text-[12.5px] font-bold uppercase tracking-[0.14em] text-rust">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[26px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[33px]">
          {title}
        </h2>
        {body && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {body}
          </p>
        )}
      </div>

      {moreTo && (
        <Link
          to={moreTo}
          className="group flex shrink-0 items-center gap-1.5 text-[14.5px] font-semibold text-ink"
        >
          {moreLabel}
          <Icon
            name="arrow"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
