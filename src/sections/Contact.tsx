import { Icon } from '../components/Icon'
import { NotifyForm } from '../components/NotifyForm'
import { site } from '../config'

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-line bg-white py-20"
    >
      <div className="shell max-w-2xl">
        <p className="mb-2.5 text-[12.5px] font-bold uppercase tracking-[0.14em] text-rust">
          문의
        </p>
        <h2 className="text-[26px] font-extrabold leading-[1.25] tracking-[-0.03em] sm:text-[33px]">
          궁금한 점이 있으면 남겨 주세요
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          상품·입점·구매 관련 문의는 아래로 보내 주시면 됩니다. 광고 메일은
          보내지 않습니다.
        </p>

        {site.contactEmail ? (
          <a
            href={`mailto:${site.contactEmail}`}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-bold text-paper"
          >
            <Icon name="mail" className="size-[18px]" />
            {site.contactEmail}
          </a>
        ) : (
          <div className="mt-8 rounded-card border border-line bg-paper p-6">
            <p className="text-[14.5px] font-semibold">이메일 알림</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
              문의 메일 주소는 준비 중입니다. 새 상품이 올라오면 알려 드리길
              원하시면 아래에서 신청해 주세요.
            </p>
            <div className="mt-5">
              <NotifyForm />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
