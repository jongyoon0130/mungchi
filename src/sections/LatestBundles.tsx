import { Link } from 'react-router-dom'
import { SectionHead } from '../components/SectionHead'
import { LotCard } from '../components/LotCard'
import { NotifyForm } from '../components/NotifyForm'
import { Icon } from '../components/Icon'
import { useLots } from '../lib/useLots'

export function LatestBundles() {
  const { data: lots, loading } = useLots()

  return (
    <section
      id="products"
      className="scroll-mt-20 border-y border-line bg-paper-deep/60 py-20"
    >
      <div className="shell">
        <SectionHead
          eyebrow="상품"
          title="전체 상품"
          body={
            lots.length > 0
              ? '등록된 상품을 둘러보고, 묶음별 구성과 가격을 확인해보세요.'
              : undefined
          }
        />

        {loading ? (
          <div className="mt-9 grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-card bg-line-soft"
              />
            ))}
          </div>
        ) : lots.length > 0 ? (
          <div className="mt-9 grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {lots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-card border border-line bg-white">
            <div className="flex flex-col items-center px-6 py-14 text-center sm:py-16">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-paper-deep text-ink-muted">
                <Icon name="camera" className="size-7" />
              </span>
              <h3 className="mt-6 text-[19px] font-bold tracking-[-0.025em]">
                아직 올라온 묶음이 없습니다
              </h3>
              <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                첫 묶음을 매입해서 검품하고 촬영하는 중입니다. 사진과 영상
                작업이 끝나는 대로 이 자리에 올라옵니다.
              </p>

              <div className="mt-8 flex w-full flex-col items-center">
                <NotifyForm />
              </div>

              <Link
                to="/sell"
                className="group mt-7 flex items-center gap-1.5 text-[14px] font-semibold text-ink"
              >
                파실 물건이 있다면 여기로
                <Icon
                  name="arrow"
                  className="size-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
