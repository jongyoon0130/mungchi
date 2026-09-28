import { NotifyForm } from '../components/NotifyForm'

export function FinalCta() {
  return (
    <section className="shell py-20">
      <div className="relative overflow-hidden rounded-[22px] bg-ink px-7 py-14 text-center text-paper sm:px-14 sm:py-20">
        <div
          className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(194,70,31,0.9), transparent 68%)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-20 size-[420px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(216,201,174,0.9), transparent 68%)',
          }}
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-[28px] font-extrabold leading-[1.22] tracking-[-0.035em] sm:text-[40px]">
            첫 묶음,
            <br />
            놓치지 마세요
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-paper/65">
            이메일만 남겨 두시면 첫 묶음이 올라올 때 가장 먼저 알려드립니다.
            광고는 보내지 않습니다.
          </p>

          <div className="mt-9 flex w-full justify-center">
            <NotifyForm dark />
          </div>
        </div>
      </div>
    </section>
  )
}
