import { Link } from 'react-router-dom'
import { SectionHead } from '../components/SectionHead'
import { Icon, type IconName } from '../components/Icon'
import { tradeSteps } from '../data/content'
import { sellingRules } from '../config'
import { krw } from '../lib/format'

export function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-20 border-y border-line bg-white py-20"
    >
      <div className="shell">
        <SectionHead
          eyebrow="이용 안내"
          title="세 단계로 끝납니다"
          body="경매가 아닙니다. 올라온 묶음을 보고, 적힌 값이 괜찮으면 사면 됩니다."
          center
        />

        <ol className="mt-12 grid gap-3.5 md:grid-cols-3">
          {tradeSteps.map((step, i) => (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-card border border-line bg-paper p-6"
            >
              <span className="absolute -right-2 -top-5 text-[88px] font-extrabold leading-none text-ink opacity-[0.055] tnum">
                {i + 1}
              </span>
              <span className="relative flex size-8 items-center justify-center rounded-full bg-rust text-[14px] font-bold text-white tnum">
                {i + 1}
              </span>
              <h3 className="relative mt-5 text-[17px] font-bold tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="relative mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        {/* 규칙을 한 줄로 못 박아 두면 신뢰가 올라간다 */}
        <dl className="mt-3.5 grid gap-3.5 rounded-card border border-line bg-paper p-6 sm:grid-cols-3">
          <Rule
            icon="tag"
            label="가격"
            value="정찰제"
            note="올린 쪽이 정하고, 깎지 않습니다"
          />
          <Rule
            icon="truck"
            label="무료배송"
            value={`${krw(sellingRules.freeShippingOver)} 이상`}
            note="묶음마다 카드에 표시됩니다"
          />
          <Rule
            icon="shield"
            label="하자 환불"
            value={`${sellingRules.refundDays}일 이내`}
            note="설명에 없던 하자면 전액"
          />
        </dl>

        {/* 파는 쪽과 사는 쪽 입구를 여기서도 갈라 준다 */}
        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          <Entry
            icon="store"
            to="/sell"
            title="물건을 파시나요?"
            body="사진과 영상을 올리고 원하는 가격만 적으면 됩니다."
            cta="도매업체 입점"
          />
          <Entry
            icon="cart"
            to="/signup"
            title="물건을 사시나요?"
            body="검품 끝난 묶음을 적힌 값에 바로 가져가실 수 있습니다."
            cta="소매업체 가입"
          />
        </div>
      </div>
    </section>
  )
}

function Rule({
  icon,
  label,
  value,
  note,
}: {
  icon: IconName
  label: string
  value: string
  note: string
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink text-paper">
        <Icon name={icon} className="size-[18px]" />
      </span>
      <div>
        <dt className="text-[12.5px] font-semibold text-ink-muted">{label}</dt>
        <dd className="mt-0.5 text-[15.5px] font-bold tracking-[-0.02em] tnum">
          {value}
        </dd>
        <p className="mt-0.5 text-[12.5px] text-ink-muted">{note}</p>
      </div>
    </div>
  )
}

function Entry({
  icon,
  to,
  title,
  body,
  cta,
}: {
  icon: IconName
  to: string
  title: string
  body: string
  cta: string
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-card border border-line bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-ink/25"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
        <Icon name={icon} className="size-[20px]" />
      </span>
      <div className="flex-1">
        <h3 className="text-[16.5px] font-bold tracking-[-0.02em]">{title}</h3>
        <p className="mt-1 text-[13.5px] leading-snug text-ink-soft">{body}</p>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-[13.5px] font-bold text-rust">
        {cta}
        <Icon
          name="arrow"
          className="size-4 transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  )
}
