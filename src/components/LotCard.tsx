import { Link } from 'react-router-dom'
import type { Lot } from '../data/types'
import { discountRate, pricePerPiece } from '../data/lots'
import { gradeLabel, krw, manwon } from '../lib/format'
import { Thumb } from './Thumb'
import { Icon } from './Icon'

export function LotCard({ lot }: { lot: Lot }) {
  const discount = discountRate(lot)

  return (
    <Link
      to={`/bundles/${lot.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_12px_28px_-14px_rgba(23,19,16,0.28)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Thumb
          lot={lot}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-rust px-2 py-0.5 text-[11px] font-bold text-white tnum">
              {discount}% 할인
            </span>
          )}
          {lot.status === 'reserved' && (
            <span className="rounded-full bg-olive px-2 py-0.5 text-[11px] font-bold text-white">
              예약중
            </span>
          )}
          {lot.status === 'sold' && (
            <span className="rounded-full bg-ink-muted px-2 py-0.5 text-[11px] font-bold text-white">
              판매완료
            </span>
          )}
          {lot.freeShipping && lot.status === 'available' && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-ink">
              무료배송
            </span>
          )}
        </div>

        {lot.video && (
          <span className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-ink/75 text-paper backdrop-blur-sm">
            <Icon name="play" className="size-2.5" />
          </span>
        )}

        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-paper backdrop-blur-sm">
            {gradeLabel[lot.grade]}
          </span>
          <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-paper backdrop-blur-sm tnum">
            {lot.pieces}장
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[12px] font-semibold text-ink-muted">
          {[lot.brand, lot.origin].filter(Boolean).join(' · ') || '묶음'}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[14.5px] font-semibold leading-snug">
          {lot.title}
        </h3>

        <div className="mt-auto pt-3.5">
          <p className="text-[11.5px] font-semibold text-ink-muted">
            개당 단가
          </p>
          <p className="mt-0.5 text-[17px] font-bold tracking-tight tnum">
            {krw(pricePerPiece(lot))}
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5 text-[12.5px] text-ink-muted tnum">
            <span>묶음 {manwon(lot.price)}</span>
            {discount > 0 && lot.listPrice && (
              <span className="line-through">{manwon(lot.listPrice)}</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
}
