import { tradeSteps } from '../data/content'
import { sellingRules } from '../config'
import { krw } from '../lib/format'

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 pb-8 sm:pb-12">
      <div className="shell grid items-center gap-10 md:grid-cols-[0.9fr_1.2fr] md:gap-12 lg:gap-16">
        <div>
          <h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
            세 단계 이용 방법
          </h2>
          <p className="mt-4 text-[16px] font-semibold leading-snug">
            경매가 아닙니다.
            <br />
            올라온 묶음을 보고, 적힌 값이 괜찮으면 구매하세요.
          </p>
          <ul className="mt-5 space-y-1.5 text-[14px] leading-relaxed text-ink-muted">
            <li>개당 단가까지 계산된 가격 정찰제</li>
            <li>{krw(sellingRules.freeShippingOver)} 이상 무료배송</li>
            <li>설명과 다름 시 {sellingRules.refundDays}일 이내 하자 환불</li>
          </ul>
        </div>

        <ol className="space-y-3">
          {tradeSteps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-1 rounded-full bg-sage px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-[18px]"
            >
              <p className="flex items-center gap-3 text-[15px] font-extrabold">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[13px] tnum">
                  {i + 1}
                </span>
                {step.title}
              </p>
              <p className="pl-10 text-[13.5px] leading-snug text-ink-soft sm:pl-0 sm:text-right">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
