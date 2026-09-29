/**
 * 전체 상품 전용 페이지. 홈의 스크롤 목록과 달리 여기만 있는 카탈로그 화면.
 * 카테고리·브랜드·검색 필터는 아직 공개하지 않는다.
 */
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LotCard } from '../components/LotCard'
import { NotifyForm } from '../components/NotifyForm'
import { Icon } from '../components/Icon'
import { pricePerPiece } from '../data/lots'
import { useLots } from '../lib/useLots'
import { comma } from '../lib/format'
import type { Lot } from '../data/types'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'discount'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'newest', label: '최근 등록순' },
  { key: 'price-asc', label: '개당 낮은 순' },
  { key: 'price-desc', label: '개당 높은 순' },
  { key: 'discount', label: '할인율 높은 순' },
]

function discountOf(lot: Lot): number {
  if (!lot.listPrice || lot.listPrice <= lot.price) return 0
  return 1 - lot.price / lot.listPrice
}

function sortLots(list: Lot[], key: SortKey): Lot[] {
  const sorted = [...list]
  switch (key) {
    case 'price-asc':
      return sorted.sort((a, b) => pricePerPiece(a) - pricePerPiece(b))
    case 'price-desc':
      return sorted.sort((a, b) => pricePerPiece(b) - pricePerPiece(a))
    case 'discount':
      return sorted.sort((a, b) => discountOf(b) - discountOf(a))
    default:
      return sorted.sort((a, b) => {
        const soldDiff =
          Number(a.status === 'sold') - Number(b.status === 'sold')
        if (soldDiff !== 0) return soldDiff
        return b.listedAt.localeCompare(a.listedAt)
      })
  }
}

export default function Bundles() {
  const [params, setParams] = useSearchParams()
  const { data: lots, loading, error } = useLots()
  const sort = (params.get('sort') as SortKey) ?? 'newest'

  const results = useMemo(() => sortLots(lots, sort), [lots, sort])

  function setSort(value: string) {
    const next = new URLSearchParams(params)
    if (value === 'newest') next.delete('sort')
    else next.set('sort', value)
    setParams(next, { replace: true })
  }

  if (loading) {
    return (
      <div className="shell py-10 sm:py-14">
        <div className="h-4 w-40 animate-pulse bg-line-soft" />
        <div className="mt-6 h-10 w-56 animate-pulse bg-line-soft" />
        <div className="mt-10 product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse bg-line-soft"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="text-[22px] font-semibold">묶음을 불러오지 못했습니다</h1>
        <p className="mt-2.5 text-[14px] text-ink-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="shell py-8 sm:py-12">
      <nav className="text-[13px] text-ink-muted">
        <Link to="/" className="hover:text-ink">
          홈
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-ink">전체 상품</span>
      </nav>

      <div className="mt-6 max-w-3xl">
        <h1 className="text-[32px] font-extrabold tracking-[-0.035em] sm:text-[40px]">
          전체 상품
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
          검품하고 사진·영상까지 찍은 구제 의류 묶음입니다. 적힌 값이 그대로
          판매가이고, 개당 단가까지 계산해 두었습니다.
        </p>
      </div>

      {lots.length === 0 ? (
        <div className="mt-12 rounded-[22px] bg-white px-6 py-16 text-center">
          <h2 className="text-[18px] font-semibold">아직 올라온 묶음이 없습니다</h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-muted">
            첫 묶음을 매입해서 검품하고 촬영하는 중입니다.
          </p>
          <div className="mt-8 flex flex-col items-center">
            <NotifyForm />
          </div>
          <Link
            to="/sell"
            className="group mt-7 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink"
          >
            도매업체로 묶음 올리러 가기
            <Icon
              name="arrow"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-10">
            <aside className="mb-6 lg:mb-0 lg:sticky lg:top-24">
              <label className="flex items-center justify-between gap-2 border-b border-line py-3 text-[14px]">
                <span className="text-ink-soft">정렬</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-[14px] font-medium outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-3 text-[13px] text-ink-muted tnum lg:hidden">
                {comma(results.length)}개 묶음
              </p>
            </aside>

            <div>
              <p className="mb-4 hidden text-right text-[13px] text-ink-muted tnum lg:block">
                {comma(results.length)}개 묶음
              </p>
              <div className="product-grid">
                {results.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
