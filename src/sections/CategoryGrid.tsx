import { Link } from 'react-router-dom'
import { SectionHead } from '../components/SectionHead'
import { Garment } from '../components/Garment'
import { categories } from '../data/categories'

export function CategoryGrid() {
  return (
    <section className="shell py-20">
      <SectionHead
        eyebrow="다룰 품목"
        title="이런 묶음을 올릴 예정입니다"
        body="회전이 빠른 품목부터 시작합니다. 카테고리를 누르면 해당 묶음만 모아서 볼 수 있습니다."
      />

      <div className="mt-9 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/bundles?category=${c.id}`}
            className="group relative overflow-hidden rounded-card border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_12px_28px_-16px_rgba(23,19,16,0.25)]"
          >
            <Garment
              category={c.id}
              className="absolute -right-4 -top-3 w-24 text-ink opacity-[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.11]"
            />
            <p className="relative text-[16px] font-bold tracking-[-0.02em]">
              {c.name}
            </p>
            <p className="relative mt-1.5 text-[12.5px] leading-snug text-ink-muted">
              {c.blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
