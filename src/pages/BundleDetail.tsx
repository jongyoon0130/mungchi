import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Thumb } from '../components/Thumb'
import { LotCard } from '../components/LotCard'
import { discountRate, pricePerPiece } from '../data/lots'
import { useLot, useLots } from '../lib/useLots'
import { categoryMap, departmentMap } from '../data/categories'
import { gradeLabel, gradeNote, krw } from '../lib/format'
import { site, sellingRules } from '../config'
import type { Lot } from '../data/types'

/** 사진 여러 장과 영상 한 편 중 지금 무엇을 보고 있는지 */
type Media = { kind: 'photo'; index: number } | { kind: 'video' }

/**
 * 썸네일 순서를 만든다. 대표 사진이 첫 칸, 영상이 둘째 칸, 나머지 사진이 뒤로
 * 간다. 사는 쪽이 대표 사진을 보고 바로 영상으로 넘어가는 순서다.
 */
function mediaOrder(lot: Lot): Media[] {
  const photoCount = Math.max(lot.photos.length, 1)
  const list: Media[] = [{ kind: 'photo', index: 0 }]
  if (lot.video) list.push({ kind: 'video' })
  for (let i = 1; i < photoCount; i++) list.push({ kind: 'photo', index: i })
  return list
}

export default function BundleDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: lot, loading } = useLot(id)
  const { data: allLots } = useLots()

  const [selected, setSelected] = useState<Media>({ kind: 'photo', index: 0 })
  const [liked, setLiked] = useState(false)

  if (loading) {
    return (
      <div className="shell py-8 sm:py-10">
        <div className="pdp">
          <div className="hidden pdp-thumb animate-pulse bg-line-soft lg:block" />
          <div className="pdp-main animate-pulse bg-line-soft" />
          <div className="h-80 animate-pulse bg-line-soft" />
        </div>
      </div>
    )
  }

  if (!lot) {
    return (
      <div className="shell py-32 text-center">
        <h1 className="text-[24px] font-extrabold">묶음을 찾을 수 없습니다</h1>
        <p className="mt-2.5 text-[14.5px] text-ink-muted">
          이미 판매됐거나 주소가 잘못되었습니다.
        </p>
        <Link
          to="/bundles"
          className="mt-7 inline-flex h-11 items-center bg-ink px-6 text-[14.5px] font-semibold text-paper"
        >
          전체 상품으로
        </Link>
      </div>
    )
  }

  const department = departmentMap.get(lot.department)
  const category = categoryMap.get(lot.category)
  const discount = discountRate(lot)
  const perPiece = pricePerPiece(lot)
  const media = mediaOrder(lot)
  const related = allLots.filter((l) => l.id !== lot.id).slice(0, 4)

  return (
    <div className="pb-8">
      <div className="shell py-8 sm:py-10">
        <nav className="text-[13px] text-ink-muted">
          <Link to="/" className="hover:text-ink">
            홈
          </Link>
          <span className="mx-1.5">›</span>
          <Link to="/bundles" className="hover:text-ink">
            전체 상품
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-ink">{lot.title}</span>
        </nav>

        <div className="pdp mt-6">
          <div className="pdp-thumbs">
            {media.map((item) => {
              const active =
                item.kind === selected.kind &&
                (item.kind === 'video' ||
                  (selected.kind === 'photo' &&
                    item.index === selected.index))

              return (
                <button
                  key={item.kind === 'video' ? 'video' : `photo-${item.index}`}
                  onClick={() => setSelected(item)}
                  aria-label={
                    item.kind === 'video'
                      ? '묶음 영상'
                      : `${item.index + 1}번째 사진`
                  }
                  className={`pdp-thumb ${
                    active ? 'ring-1 ring-ink' : 'ring-1 ring-transparent hover:ring-ink/25'
                  }`}
                >
                  <Thumb
                    lot={lot}
                    index={item.kind === 'video' ? 0 : item.index}
                  />
                  {item.kind === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/35">
                      <span className="flex size-7 items-center justify-center rounded-full bg-white/90 text-ink">
                        <Icon name="play" className="size-3" />
                      </span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="pdp-main">
            {selected.kind === 'video' && lot.video ? (
              <video
                key={lot.video}
                src={lot.video}
                controls
                autoPlay
                playsInline
                className="h-full w-full bg-ink object-contain"
              />
            ) : (
              <>
                <Thumb
                  lot={lot}
                  index={selected.kind === 'photo' ? selected.index : 0}
                />
                {lot.photos.length === 0 && (
                  <span className="absolute bottom-3.5 left-3.5 bg-ink/80 px-3 py-1 text-[12px] font-semibold text-paper">
                    사진 준비 중
                  </span>
                )}
              </>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[28px]">
              {lot.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="leading-none">
                <span className="text-[22px] font-semibold tracking-tight tnum">
                  {krw(perPiece)}
                </span>
                <span className="text-[15px] font-medium text-ink-muted">
                  /장
                </span>
                <span className="ml-1.5 text-[15px] font-medium text-ink-muted tnum">
                  ({krw(lot.price)})
                </span>
                {discount > 0 && lot.listPrice && (
                  <span className="ml-2 text-[14px] text-ink-muted line-through tnum">
                    {krw(lot.listPrice)}
                  </span>
                )}
              </p>
              {lot.freeShipping && (
                <span className="text-[13px] text-ink-muted">무료배송</span>
              )}
            </div>

            {discount > 0 && (
              <span className="mt-3 inline-flex bg-ink px-2 py-0.5 text-[12px] font-semibold text-white tnum">
                {discount}% 할인
              </span>
            )}

            <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
              {lot.summary}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <span className="text-[14px] text-ink-muted">수량:</span>
              <span className="bg-ink px-2.5 py-1 text-[13px] font-semibold text-paper tnum">
                {lot.pieces}장
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                onClick={() => setLiked((v) => !v)}
                aria-label="찜하기"
                aria-pressed={liked}
                className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  liked
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line text-ink-muted hover:border-ink/40'
                }`}
              >
                <Icon name="heart" className="size-5" strokeWidth={1.8} />
              </button>
              <BuyButton lot={lot} />
            </div>

            <dl className="mt-8">
              <InfoRow label="부문">{department?.name ?? '공용'}</InfoRow>
              <InfoRow label="카테고리">{category?.name ?? '-'}</InfoRow>
              {lot.brand ? <InfoRow label="브랜드">{lot.brand}</InfoRow> : null}
              <InfoRow label="상태 등급">{gradeLabel[lot.grade]}</InfoRow>
              <InfoRow label="시즌">{lot.season}</InfoRow>
              <InfoRow label="총 중량">{lot.weightKg}kg</InfoRow>
              <InfoRow label="매입처">{lot.origin}</InfoRow>
              <InfoRow label="구매자 보호">
                설명에 없던 하자가 있으면 수령 후 {sellingRules.refundDays}일
                안에 전액 환불합니다.
              </InfoRow>
            </dl>
          </div>
        </div>

        <section className="mt-14 max-w-[960px]">
          <h2 className="text-[18px] font-extrabold tracking-[-0.025em]">
            이런 게 들어 있습니다
          </h2>
          <ul className="mt-4 space-y-2">
            {lot.contents.map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 border-b border-line py-3"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-olive/12 text-olive">
                  <Icon name="check" className="size-3" strokeWidth={3.5} />
                </span>
                <span className="text-[14.5px] leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 max-w-[960px]">
          <h2 className="text-[18px] font-extrabold tracking-[-0.025em]">
            상태
          </h2>
          <div className="mt-4 flex items-center gap-2.5">
            <span className="bg-ink px-3 py-1 text-[13px] font-bold text-paper">
              {gradeLabel[lot.grade]}
            </span>
            <span className="text-[14px] font-semibold">
              {lot.grade === 'A'
                ? '바로 판매 가능'
                : lot.grade === 'B'
                  ? '세탁·수선 권장'
                  : '단가 우선'}
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
            {gradeNote[lot.grade]}
          </p>
          {lot.conditionNotes && (
            <p className="mt-4 bg-white px-4 py-3.5 text-[14px] leading-relaxed">
              <strong className="font-bold">특이사항 · </strong>
              {lot.conditionNotes}
            </p>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className="shell mt-6">
          <h2 className="text-[21px] font-extrabold tracking-[-0.03em]">
            다른 상품
          </h2>
          <div className="mt-6 product-grid">
            {related.map((l) => (
              <LotCard key={l.id} lot={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * 구매 버튼. 결제를 아직 붙이지 않았으니 메일로 구매 의사를 받는다.
 * 결제가 붙으면 이 컴포넌트만 고치면 된다.
 */
function BuyButton({ lot }: { lot: Lot }) {
  if (lot.status === 'sold') {
    return (
      <div className="flex h-12 flex-1 items-center justify-center bg-line-soft text-[14.5px] font-semibold text-ink-muted">
        판매 완료된 묶음입니다
      </div>
    )
  }

  if (lot.status === 'reserved') {
    return (
      <div className="flex h-12 flex-1 items-center justify-center bg-olive/12 text-[14.5px] font-semibold text-olive">
        예약중 · 입금 확인 중입니다
      </div>
    )
  }

  if (!site.contactEmail) {
    return (
      <div className="flex h-12 flex-1 items-center justify-center gap-2 bg-ink text-paper">
        <Icon name="cart" className="size-[18px]" />
        <span className="text-[14.5px] font-semibold">구매 창구 준비 중</span>
      </div>
    )
  }

  const subject = encodeURIComponent(`[구매 문의] ${lot.id} ${lot.title}`)
  const body = encodeURIComponent(
    [
      `아래 묶음을 구매하고 싶습니다.`,
      ``,
      `묶음 번호: ${lot.id}`,
      `제목: ${lot.title}`,
      `수량: ${lot.pieces}장`,
      `판매가: ${krw(lot.price)} (개당 ${krw(pricePerPiece(lot))})`,
      ``,
      `사업자명:`,
      `연락처:`,
      `배송지:`,
    ].join('\n'),
  )

  return (
    <a
      href={`mailto:${site.contactEmail}?subject=${subject}&body=${body}`}
      className="btn btn-accent h-12 flex-1 rounded-none"
    >
      <Icon name="cart" className="size-[18px]" />
      구매 신청하기
    </a>
  )
}

function InfoRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-8 border-b border-line py-3.5">
      <dt className="shrink-0 text-[14px] text-ink-muted">{label}</dt>
      <dd className="text-right text-[14px] leading-snug">{children}</dd>
    </div>
  )
}
