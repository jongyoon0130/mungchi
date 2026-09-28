export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 28 28" className="size-7 shrink-0" aria-hidden="true">
        {/* 옷이 겹쳐 쌓인 '묶음'을 세 겹으로 표현 */}
        <rect x="2" y="2" width="24" height="24" rx="7" fill="#171310" />
        <path
          d="M8 10.5h12M8 14h12M8 17.5h7"
          stroke="#FBF8F3"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="19" cy="17.5" r="1.6" fill="#C2461F" />
      </svg>
      <span className="text-[19px] font-extrabold tracking-[-0.04em]">뭉치</span>
    </span>
  )
}
