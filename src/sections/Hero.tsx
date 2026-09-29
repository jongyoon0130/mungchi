import { Link } from 'react-router-dom'
import { NotifyForm } from '../components/NotifyForm'
import { useLots } from '../lib/useLots'

export function Hero() {
  const { data: lots } = useLots()
  const hasLots = lots.length > 0

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="/brand/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper-deep to-transparent" />

      <div className="shell relative flex min-h-[520px] items-center py-20 sm:min-h-[620px] sm:py-24">
        <div className="max-w-3xl text-white">
          <p className="text-[15px] font-medium text-white/90 sm:text-[16px]">
            등록된 상품을 둘러보고, 묶음별 구성과 가격을 확인해보세요.
          </p>
          <h1 className="mt-4 text-[36px] font-extrabold leading-[1.18] tracking-[-0.04em] sm:text-[52px]">
            구제 의류 묶음을
            <br />
            적힌 값에 삽니다
          </h1>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {hasLots ? (
              <a href="#products" className="btn btn-lg btn-ghost">
                전체 상품 보기
              </a>
            ) : (
              <Link to="/signup" className="btn btn-lg btn-ghost">
                소매업체로 둘러보기
              </Link>
            )}
            <Link to="/sell" className="btn btn-lg btn-ghost">
              도매업체로 물건 올리기
            </Link>
          </div>

          {!hasLots && (
            <div className="mt-8 max-w-md">
              <p className="mb-3 text-[13px] font-medium text-white/80">
                첫 묶음이 올라오면 알려드릴까요?
              </p>
              <NotifyForm dark />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
