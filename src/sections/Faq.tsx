import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'
import { faqs } from '../data/content'

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-white py-20">
      <div className="shell max-w-3xl">
        <SectionHead
          eyebrow="자주 묻는 질문"
          title="궁금하실 것들"
          center
        />

        <div className="mt-10 divide-y divide-line-soft overflow-hidden rounded-card border border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group bg-paper">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4.5 text-[15px] font-semibold transition-colors hover:bg-paper-deep/50">
                <span className="flex-1">{item.q}</span>
                <Icon
                  name="chevron"
                  className="size-4 shrink-0 rotate-90 text-ink-muted transition-transform group-open:-rotate-90"
                />
              </summary>
              <p className="px-5 pb-5 text-[14.5px] leading-[1.75] text-ink-soft">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
