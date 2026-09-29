import { promises } from '../data/content'

export function Promises() {
  return (
    <section className="py-16 sm:py-20">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.035em] sm:text-[34px]">
            브랜드에 맞는 묶음을 골라보세요
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            카테고리로 나누기 전에, 지금 올라온 상품을 바로 살펴보시면 됩니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {promises.map((p) => (
            <article
              key={p.title}
              className="relative isolate min-h-[220px] overflow-hidden rounded-[22px] sm:min-h-[240px]"
            >
              <img
                src={p.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-ink/10" />
              <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 text-white sm:min-h-[240px]">
                <h3 className="break-keep text-[17px] font-extrabold leading-snug tracking-[-0.02em]">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">
                  {p.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
