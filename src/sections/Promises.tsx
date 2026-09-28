import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'
import { promises } from '../data/content'

export function Promises() {
  return (
    <section className="shell py-20">
      <SectionHead
        eyebrow="장점"
        title="매장에 맞는 묶음을 고를 수 있습니다"
        body="카테고리로 나누기 전에, 지금 올라온 상품을 바로 살펴보시면 됩니다."
        center
      />

      <div className="mt-12 grid gap-3.5 md:grid-cols-3">
        {promises.map((p) => (
          <div
            key={p.title}
            className="rounded-card border border-line bg-white p-6 transition-colors hover:border-ink/20"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-ink text-paper">
              <Icon name={p.icon} className="size-[22px]" />
            </span>
            <h3 className="mt-5 text-[16.5px] font-bold leading-snug tracking-[-0.02em]">
              {p.title}
            </h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
