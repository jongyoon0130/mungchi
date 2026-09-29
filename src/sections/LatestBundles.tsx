import { Link } from 'react-router-dom'
import { SectionHead } from '../components/SectionHead'
import { LotCard } from '../components/LotCard'
import { NotifyForm } from '../components/NotifyForm'
import { Icon } from '../components/Icon'
import { useLots } from '../lib/useLots'

export function LatestBundles() {
  const { data: lots, loading } = useLots()

  return (
    <section id="products" className="scroll-mt-24 py-16 sm:py-20">
      <div className="shell">
        <SectionHead
          title="전체 상품"
          body={
            lots.length > 0
              ? '등록된 상품을 둘러보고, 묶음별 구성과 가격을 확인해보세요.'
              : undefined
          }
          moreTo={lots.length > 0 ? '/bundles' : undefined}
          moreLabel="전체 보기"
        />

        {loading ? (
          <div className="mt-10 product-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse bg-line-soft"
              />
            ))}
          </div>
        ) : lots.length > 0 ? (
          <div className="mt-10 product-grid">
            {lots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[22px] bg-white px-6 py-16 text-center">
            <h3 className="text-[18px] font-extrabold">
              아직 올라온 묶음이 없습니다
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-muted">
              첫 묶음을 매입해서 검품하고 촬영하는 중입니다. 사진과 영상 작업이
              끝나는 대로 이 자리에 올라옵니다.
            </p>
            <div className="mt-8 flex flex-col items-center">
              <NotifyForm />
            </div>
            <Link
              to="/sell"
              className="group mt-7 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink"
            >
              파실 물건이 있다면 여기로
              <Icon
                name="arrow"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <Entry
            icon="store"
            title="물건을 판매 하시나요?"
            to="/sell"
            cta="도매업체 입점"
          />
          <Entry
            icon="cart"
            title="물건을 구매 하시나요?"
            to="/signup"
            cta="소매업체 입점"
          />
        </div>
      </div>
    </section>
  )
}

function Entry({
  icon,
  title,
  to,
  cta,
}: {
  icon: 'store' | 'cart'
  title: string
  to: string
  cta: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-full bg-sage px-5 py-3.5 sm:px-6">
      <p className="flex min-w-0 items-center gap-2.5 text-[14.5px] font-extrabold">
        <Icon name={icon} className="size-[18px] shrink-0" />
        <span className="truncate">{title}</span>
      </p>
      <Link to={to} className="btn btn-solid h-9 shrink-0 px-4 text-[13px]">
        {cta}
        <Icon name="arrow" className="size-3.5" />
      </Link>
    </div>
  )
}
