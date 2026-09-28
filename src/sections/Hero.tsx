import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { NotifyForm } from '../components/NotifyForm'
import { useLots } from '../lib/useLots'

export function Hero() {
  const { data: lots } = useLots()
  const hasLots = lots.length > 0

  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-20">
      {/* 배경의 따뜻한 번짐 — 종이 위에 조명을 얹은 느낌 */}
      <div
        className="pointer-events-none absolute -right-40 -top-48 size-[640px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(216,201,174,0.85), transparent 68%)',
        }}
      />

      <div className="shell relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5">
          <span className="flex size-1.5 rounded-full bg-rust" />
          <span className="text-[12.5px] font-semibold text-ink-soft">
            {hasLots ? '판매 중' : '첫 묶음 준비 중'}
          </span>
        </div>

        <h1 className="mt-6 text-[40px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-[58px]">
          구제 의류 묶음을
          <br />
          <span className="text-rust">적힌 값</span>에 삽니다
        </h1>

        <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          검품하고 전부 펼쳐 사진 찍은 묶음만 올립니다. 한 장씩 넘겨 보는 영상과
          개당 단가까지 다 보고 나서, 살지 말지만 정하시면 됩니다.
        </p>

        {/* 사는 쪽과 파는 쪽이 첫 화면에서 갈라지게 한다 */}
        <div className="mt-9 flex flex-wrap items-center gap-2.5">
          {hasLots ? (
            <Link
              to="/bundles"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 text-[15.5px] font-bold text-paper transition-transform hover:scale-[1.03] active:scale-95"
            >
              판매 중 묶음 보기
              <Icon name="arrow" className="size-4" />
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 text-[15.5px] font-bold text-paper transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Icon name="cart" className="size-[18px]" />
              소매업체로 둘러보기
            </Link>
          )}
          <Link
            to="/sell"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-line bg-white px-7 text-[15.5px] font-semibold transition-colors hover:border-ink/30"
          >
            <Icon name="store" className="size-[18px]" />
            도매업체로 물건 올리기
          </Link>
        </div>

        {!hasLots && (
          <div className="mt-8">
            <p className="mb-3 text-[14px] font-semibold text-ink">
              첫 묶음이 올라오면 알려드릴까요?
            </p>
            <NotifyForm />
          </div>
        )}

        <ul className="mt-12 grid max-w-2xl gap-x-8 gap-y-3.5 border-t border-line pt-8 sm:grid-cols-2">
          {[
            '묶음에 들어가는 옷 전부 촬영',
            '한 장씩 넘겨 보는 영상 함께 제공',
            '개당 단가까지 계산된 정찰가',
            '설명과 다르면 7일 내 전액 환불',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-olive/12 text-olive">
                <Icon name="check" className="size-3" strokeWidth={3.5} />
              </span>
              <span className="text-[14.5px] leading-snug text-ink-soft">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
