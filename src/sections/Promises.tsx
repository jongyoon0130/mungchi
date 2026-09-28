import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'
import { promises } from '../data/content'

export function Promises() {
  return (
    <section className="shell py-20">
      <SectionHead
        eyebrow="우리가 지키는 것"
        title="랜덤 묶음을 팔지 않습니다"
        body="구제 사입에서 제일 불안한 건 열어보기 전까지 모른다는 점입니다. 그 불안을 없애는 데 필요한 것만 약속합니다."
        center
      />

      <div className="mt-12 grid gap-3.5 md:grid-cols-2 lg:grid-cols-4">
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
