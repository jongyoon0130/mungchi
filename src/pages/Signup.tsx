import { Link } from 'react-router-dom'
import { Icon, type IconName } from '../components/Icon'
import { NotifyForm } from '../components/NotifyForm'
import { sellingRules } from '../config'

/**
 * 소매업체용 입구. 사는 쪽이 여기로 들어와서 묶음 목록까지 간다.
 * 파는 쪽(도매업체) 입구는 `/sell`에 따로 있다.
 */

const perks: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'tag',
    title: '가격이 그대로 적혀 있습니다',
    body: '개당 단가와 묶음 전체 가격이 처음부터 보입니다. 입찰 경쟁이 없으니 마감 시간을 지킬 필요도 없습니다.',
  },
  {
    icon: 'video',
    title: '사진과 영상을 다 보고 삽니다',
    body: '펼쳐 찍은 사진에 더해, 옷을 한 장씩 넘겨 보여주는 영상이 함께 올라옵니다. 실물과 다를 여지를 줄였습니다.',
  },
  {
    icon: 'shield',
    title: '설명에 없던 하자는 환불합니다',
    body: `구성 내역과 하자를 미리 적어 올립니다. 적히지 않은 하자가 있으면 수령 후 ${sellingRules.refundDays}일 안에 전액 환불합니다.`,
  },
]

export default function Signup() {
  return (
    <div>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="shell py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-bold">
              <Icon name="cart" className="size-3.5" />
              소매업체용
            </span>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-[-0.04em] sm:text-[46px]">
              검품 끝난 묶음을
              <br />
              적힌 값에 바로
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              도매업체가 올린 가격이 그대로 판매가입니다. 개당 단가를 보고 살지
              말지만 정하시면 됩니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <Link
                to="/#products"
                className="flex h-13 items-center gap-2 rounded-full bg-ink px-7 text-[15.5px] font-bold text-paper transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Icon name="arrow" className="size-[18px]" />
                전체 상품 보기
              </Link>
              <Link
                to="/sell"
                className="flex h-13 items-center gap-2 rounded-full border border-line bg-white px-7 text-[15.5px] font-semibold transition-colors hover:border-ink/30"
              >
                <Icon name="store" className="size-[18px]" />
                물건을 파시나요?
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="grid gap-3.5 md:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-card border border-line bg-white p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-paper-deep text-ink">
                <Icon name={perk.icon} className="size-[18px]" />
              </span>
              <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.025em]">
                {perk.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                {perk.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-16 text-center sm:py-20">
          <h2 className="text-[24px] font-extrabold tracking-[-0.035em] sm:text-[28px]">
            새 묶음이 올라오면 알려드릴까요?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            이메일을 남겨 주시면 새 상품이 올라올 때 먼저 알려드립니다.
          </p>
          <div className="mt-7 flex justify-center">
            <NotifyForm />
          </div>
        </div>
      </section>
    </div>
  )
}
