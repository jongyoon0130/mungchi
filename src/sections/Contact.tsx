import { Coil } from '../components/Logo'
import { site } from '../config'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-24 overflow-hidden py-20 sm:py-24"
    >
      <Coil className="pointer-events-none absolute -right-16 bottom-[-20%] h-[420px] w-[420px] text-sage/70 sm:right-8 sm:h-[520px] sm:w-[520px]" />

      <div className="shell relative">
        <h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
          궁금한 점이 있으면 남겨 주세요
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          상품·입점·구매 관련 문의는 아래로 보내 주시면 됩니다. 광고 메일은
          보내지 않습니다.
        </p>

        <div className="mt-10 max-w-lg">
          {site.contactEmail ? (
            <a href={`mailto:${site.contactEmail}`} className="btn btn-solid btn-lg">
              {site.contactEmail}
            </a>
          ) : (
            <div>
              <p className="text-[15px] font-extrabold">이메일 알림</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                문의 메일 주소는 준비 중입니다.
              </p>
              <p className="mt-5 text-[14px] leading-relaxed text-ink-muted">
                새 상품이 올라오면 알려 드리길 원하시면 아래에서 신청해 주세요.
                알림 신청 창구를 준비하고 있습니다. 조금만 기다려 주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
