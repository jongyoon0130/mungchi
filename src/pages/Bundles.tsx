/**
 * 카테고리·브랜드 필터가 있는 예전 전체 목록 페이지.
 * 상품 수가 적을 때는 쓰지 않고 홈의「전체 상품」만 보여 준다.
 * 나중에 필터를 다시 켤 때 이 파일을 라우트에 붙이면 된다.
 */
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LotCard } from '../components/LotCard'
import { NotifyForm } from '../components/NotifyForm'
import { Icon } from '../components/Icon'
import { pricePerPiece } from '../data/lots'
import { useLots } from '../lib/useLots'
import { categories, categoryMap, departments } from '../data/categories'
import { comma } from '../lib/format'
import type {
  CategoryId,
  DepartmentId,
  Grade,
  Lot,
  LotStatus,
} from '../data/types'

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'discount'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'newest', label: '최근 등록순' },
  { key: 'price-asc', label: '개당 낮은 순' },
  { key: 'price-desc', label: '개당 높은 순' },
  { key: 'discount', label: '할인율 높은 순' },
]

const grades: { key: Grade; label: string }[] = [
  { key: 'A', label: 'A급' },
  { key: 'B', label: 'B급' },
  { key: 'MIX', label: '믹스' },
]

const statuses: { key: LotStatus; label: string }[] = [
  { key: 'available', label: '판매 중' },
  { key: 'reserved', label: '예약중' },
  { key: 'sold', label: '판매완료' },
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
      // 최근 등록순 — 판매 완료된 건 뒤로 밀어 둔다
      return sorted.sort((a, b) => {
        const soldDiff = Number(a.status === 'sold') - Number(b.status === 'sold')
        if (soldDiff !== 0) return soldDiff
        return b.listedAt.localeCompare(a.listedAt)
      })
  }
}

export default function Bundles() {
  const [params, setParams] = useSearchParams()
  const { data: lots, loading, error } = useLots()

  const department = params.get('department')
  const category = params.get('category')
  const grade = params.get('grade')
  const status = params.get('status')
  const sort = (params.get('sort') as SortKey) ?? 'newest'

  const results = useMemo(() => {
    const filtered = lots.filter((l) => {
      if (department && l.department !== department) return false
      if (category && l.category !== category) return false
      if (grade && l.grade !== grade) return false
      if (status && l.status !== status) return false
      return true
    })
    return sortLots(filtered, sort)
  }, [lots, department, category, grade, status, sort])

  /** 필터 하나만 갈아끼우고 나머지는 유지한다 */
  function setFilter(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (value === null || next.get(key) === value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const activeCount = ['department', 'category', 'grade', 'status'].filter((k) =>
    params.get(k),
  ).length

  const heading = category
    ? (categoryMap.get(category as CategoryId)?.name ?? '묶음')
    : '판매 중인 묶음'

  if (loading) {
    return (
      <div className="shell py-10 sm:py-14">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-line-soft" />
        <div className="mt-8 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-card bg-line-soft"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shell py-28 text-center">
        <h1 className="text-[22px] font-extrabold">
          묶음을 불러오지 못했습니다
        </h1>
        <p className="mt-2.5 text-[14px] text-ink-muted">{error}</p>
      </div>
    )
  }

  // 아직 아무것도 등록하지 않은 단계. 필터를 보여줄 이유가 없다.
  if (lots.length === 0) {
    return (
      <div className="shell py-16 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-paper-deep text-ink-muted">
            <Icon name="camera" className="size-8" />
          </span>
          <h1 className="mt-7 text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
            아직 올라온 묶음이 없습니다
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
            첫 묶음을 매입해서 검품하고 촬영하는 중입니다. 묶음에 들어가는 옷을
            전부 펼쳐 찍고, 한 장씩 넘겨 보는 영상과 하자까지 적어서 올릴
            예정입니다.
          </p>

          <div className="mt-9 flex flex-col items-center">
            <p className="mb-3 text-[14px] font-semibold">
              첫 묶음이 올라오면 알려드릴까요?
            </p>
            <NotifyForm />
          </div>

          <div className="mt-12 border-t border-line pt-9 text-left">
            <h2 className="text-[15px] font-bold">앞으로 다룰 품목</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-ink-soft"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/sell"
            className="group mt-10 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink"
          >
            도매업체로 묶음 올리러 가기
            <Icon
              name="arrow"
              className="size-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="shell py-10 sm:py-14">
      <nav className="text-[13px] text-ink-muted">
        <Link to="/" className="hover:text-ink">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{heading}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-[-0.035em] sm:text-[38px]">
            {heading}
          </h1>
          <p className="mt-2 text-[14.5px] text-ink-muted tnum">
            {comma(results.length)}개 묶음
          </p>
        </div>

        <label className="flex items-center gap-2 text-[14px]">
          <span className="text-ink-muted">정렬</span>
          <select
            value={sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="h-10 rounded-full border border-line bg-white px-4 pr-8 text-[14px] font-semibold outline-none focus:border-ink"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[236px_1fr] lg:gap-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold">필터</h2>
            {activeCount > 0 && (
              <button
                onClick={() => setParams(sort === 'newest' ? {} : { sort })}
                className="flex items-center gap-1 text-[13px] font-semibold text-rust"
              >
                <Icon name="close" className="size-3.5" strokeWidth={2.4} />
                초기화
              </button>
            )}
          </div>

          <FilterGroup title="판매 상태">
            {statuses.map((s) => (
              <Chip
                key={s.key}
                active={status === s.key}
                onClick={() => setFilter('status', s.key)}
              >
                {s.label}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="부문">
            {departments.map((d) => (
              <Chip
                key={d.id}
                active={department === (d.id as DepartmentId)}
                onClick={() => setFilter('department', d.id)}
              >
                {d.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="카테고리">
            {categories.map((c) => (
              <Chip
                key={c.id}
                active={category === c.id}
                onClick={() => setFilter('category', c.id)}
              >
                {c.name}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup title="상태 등급">
            {grades.map((g) => (
              <Chip
                key={g.key}
                active={grade === g.key}
                onClick={() => setFilter('grade', g.key)}
              >
                {g.label}
              </Chip>
            ))}
          </FilterGroup>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-card border border-line bg-white px-6 py-20 text-center">
              <p className="text-[16px] font-bold">조건에 맞는 묶음이 없습니다</p>
              <p className="mt-2 text-[14px] text-ink-muted">
                필터를 하나씩 풀어 보세요.
              </p>
              <button
                onClick={() => setParams({})}
                className="mt-6 h-11 rounded-full bg-ink px-6 text-[14.5px] font-semibold text-paper"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-6 border-t border-line pt-5">
      <h3 className="text-[13px] font-bold tracking-wide text-ink-muted">
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-white text-ink-soft hover:border-ink/30'
      }`}
    >
      {children}
    </button>
  )
}
