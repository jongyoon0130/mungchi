import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { NotifyForm } from '../components/NotifyForm'
import { sellingRules } from '../config'
import { krw } from '../lib/format'

/**
 * 도매업체용 입구. 물건을 올리는 쪽이 여기로 들어와서 등록 화면까지 간다.
 * 사는 쪽(소매업체) 입구는 `/signup`에 따로 있다.
 */

const steps: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'camera',
    title: '사진과 영상을 올린다',
    body: '묶음을 펼쳐 찍은 사진 여러 장과, 옷을 한 장씩 넘겨 보여주는 영상 한 편을 올립니다. 영상은 없어도 등록됩니다.',
  },
  {
    icon: 'tag',
    title: '원하는 가격을 적는다',
    body: '경매가 아닙니다. 받고 싶은 금액을 그대로 적으면 그게 판매가가 됩니다. 정가를 같이 적으면 할인율이 붙습니다.',
  },
  {
    icon: 'cart',
    title: '사는 쪽이 결정한다',
    body: '소매업체가 개당 단가와 구성 내역을 보고 살지 말지만 정합니다. 기다렸다가 낙찰을 받는 과정이 없습니다.',
  },
]

const rules: { term: string; desc: string }[] = [
  {
    term: '가격 결정권',
    desc: '올리는 분이 정합니다. 뭉치가 값을 깎거나 다시 매기지 않습니다.',
  },
  {
    term: '하자 고지',
    desc: `얼룩·구멍·수선 필요한 부분을 등록할 때 적어 주세요. 설명에 없던 하자는 수령 후 ${sellingRules.refundDays}일 안에 환불 대상이 됩니다.`,
  },
  {
    term: '무료배송',
    desc: `${krw(sellingRules.freeShippingOver)} 이상이면 등록 양식이 무료배송을 기본으로 켭니다. 직접 끄실 수 있습니다.`,
  },
]

export default function Sell() {
  return (
    <div>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="shell py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-bold">
              <Icon name="store" className="size-3.5" />
              도매업체용
            </span>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">
              창고에 있는 묶음,
              <br />
              원하는 가격에 올리세요
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              사진과 영상을 올리고 받고 싶은 금액만 적으면 끝입니다. 입찰을
              기다릴 필요 없이, 그 값을 보고 살 소매업체가 바로 연락합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <Link
                to="/register"
                className="flex h-13 items-center gap-2 rounded-full bg-rust px-7 text-[15.5px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Icon name="plus" className="size-[18px]" strokeWidth={2.4} />
                묶음 올리러 가기
              </Link>
              <Link
                to="/admin"
                className="flex h-13 items-center gap-2 rounded-full border border-line bg-white px-7 text-[15.5px] font-semibold transition-colors hover:border-ink/30"
              >
                <Icon name="box" className="size-[18px]" />
                내 묶음 관리
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <h2 className="text-[26px] font-extrabold tracking-[-0.035em] sm:text-[32px]">
          올리는 방법은 세 단계입니다
        </h2>
        <div className="mt-9 grid gap-3.5 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-card border border-line bg-white p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-paper-deep text-ink">
                  <Icon name={step.icon} className="size-[18px]" />
                </span>
                <span className="text-[12px] font-bold text-ink-muted tnum">
                  STEP {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.025em]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
            <div>
              <h2 className="text-[26px] font-extrabold tracking-[-0.035em] sm:text-[32px]">
                올리기 전에
                <br />
                알아 두실 것
              </h2>
            </div>
            <dl className="divide-y divide-line-soft border-t border-line">
              {rules.map((rule) => (
                <div key={rule.term} className="flex flex-col gap-2 py-5 sm:flex-row sm:gap-8">
                  <dt className="w-32 shrink-0 text-[14.5px] font-bold">
                    {rule.term}
                  </dt>
                  <dd className="text-[14.5px] leading-relaxed text-ink-soft">
                    {rule.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 text-center sm:py-20">
          <h2 className="text-[24px] font-extrabold tracking-[-0.035em] sm:text-[28px]">
            입점 상담이 필요하신가요?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            보유하신 물량과 품목을 알려 주시면 어떤 단위로 올리는 게 좋을지 같이
            정리해 드립니다.
          </p>
          <div className="mt-7 flex justify-center">
            <NotifyForm />
          </div>
        </div>
      </section>
    </div>
  )
}
