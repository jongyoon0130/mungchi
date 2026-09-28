/**
 * 등록 양식에서 쓰는 입력 요소들. 라벨과 도움말을 항상 붙여서
 * 사진 찍고 나서 무엇을 적어야 하는지 헷갈리지 않게 한다.
 */

const inputClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14.5px] outline-none transition-colors placeholder:text-ink-muted focus:border-ink'

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[13.5px] font-bold">
        {label}
        {required ? (
          <span className="text-rust">*</span>
        ) : (
          <span className="rounded bg-paper-deep px-1.5 py-0.5 text-[11px] font-semibold text-ink-muted">
            선택
          </span>
        )}
      </span>
      {hint && (
        <span className="mt-1 block text-[12.5px] leading-snug text-ink-muted">
          {hint}
        </span>
      )}
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  suffix,
  step,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  suffix?: string
  step?: string
}) {
  return (
    <span className="relative block">
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} tnum ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-ink-muted">
          {suffix}
        </span>
      )}
    </span>
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${inputClass} resize-y leading-relaxed`}
    />
  )
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={inputClass}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/** 켜고 끄는 항목. 라벨 전체가 클릭 영역이 되게 Field 밖에 따로 둔다. */
export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white px-3.5 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[#8C3B1E]"
      />
      <span>
        <span className="block text-[13.5px] font-bold">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">
            {hint}
          </span>
        )}
      </span>
    </label>
  )
}

export function FormSection({
  step,
  title,
  body,
  children,
}: {
  step: number
  title: string
  body?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card border border-line bg-paper p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-paper tnum">
          {step}
        </span>
        <div>
          <h2 className="text-[17px] font-extrabold tracking-[-0.025em]">
            {title}
          </h2>
          {body && (
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">
              {body}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  )
}
