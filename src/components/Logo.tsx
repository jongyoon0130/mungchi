/** 브랜드 마크. 시안의 실타래(뭉치) 스트로크. */
export const coilPath =
  'M28 81c-4-24 0-54 20-60 13-4 26 6 21 21-3 10-14 13-21 6-5-5 1-14 11-13 11 1 17 13 12 26-4 12-11 24-16 27'

export function Coil({
  className = '',
  strokeWidth = 12,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={coilPath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Mark({ className = 'size-9' }: { className?: string }) {
  return (
    <img
      src="/brand/mark.png?v=3"
      alt=""
      className={`shrink-0 object-contain ${className}`}
      width={36}
      height={36}
    />
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Mark className="size-9" />
      <span className="text-[20px] font-extrabold tracking-[-0.06em]">뭉치</span>
    </span>
  )
}
