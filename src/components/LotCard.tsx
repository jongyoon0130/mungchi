import { Link } from 'react-router-dom'
import type { Lot } from '../data/types'
import { discountRate, pricePerPiece } from '../data/lots'
import { krw } from '../lib/format'
import { Thumb } from './Thumb'
import { Icon } from './Icon'

export function LotCard({ lot }: { lot: Lot }) {
  const discount = discountRate(lot)

  return (
    <Link to={`/bundles/${lot.id}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-paper-deep">
        <Thumb
          lot={lot}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {discount > 0 && (
          <span className="absolute left-0 top-0 bg-ink px-2 py-1 text-[11px] font-semibold text-white tnum">
            {discount}%
          </span>
        )}

        <span className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center text-ink/55">
          <Icon name="heart" className="size-5" strokeWidth={1.7} />
        </span>

        {lot.video && (
          <span className="absolute bottom-2 right-2 flex size-6 items-center justify-center bg-ink/80 text-paper">
            <Icon name="play" className="size-2.5" />
          </span>
        )}

        {lot.status !== 'available' && (
          <span className="absolute bottom-0 left-0 bg-ink px-2 py-1 text-[11px] font-semibold text-white">
            {lot.status === 'reserved' ? '예약중' : '판매완료'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-snug group-hover:underline group-hover:underline-offset-2">
          {lot.title}
        </h3>
        <p className="mt-2 text-[16px] font-semibold tracking-tight tnum">
          {krw(lot.price)}
        </p>
        <p className="mt-0.5 text-[13px] text-ink-muted tnum">
          {krw(pricePerPiece(lot))} /장
        </p>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          {lot.freeShipping ? '무료배송' : `${lot.pieces}장`}
        </p>
      </div>
    </Link>
  )
}
