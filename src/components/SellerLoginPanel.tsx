import { useState } from 'react'
import { signIn, signInWithGoogle } from '../lib/auth'

export function SellerLoginPanel() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showEmail, setShowEmail] = useState(false)

  async function handleGoogle() {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="shell py-20 sm:py-28">
      <div className="mx-auto max-w-sm">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          판매자
        </span>
        <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.035em]">
          로그인
        </h1>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
          묶음을 올리려면 구글 계정으로 들어가면 됩니다.
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="btn btn-line btn-lg mt-8 w-full"
        >
          <GoogleMark />
          {busy ? '구글로 이동 중...' : 'Google로 계속하기'}
        </button>

        {error && (
          <p className="mt-4 rounded-xl bg-rust/8 px-4 py-3 text-[13.5px] font-medium text-rust">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowEmail((v) => !v)}
          className="mt-6 w-full text-center text-[13px] font-semibold text-ink-muted underline decoration-line underline-offset-4"
        >
          {showEmail ? '이메일 로그인 접기' : '이메일로 로그인'}
        </button>

        {showEmail && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[13.5px] font-bold">이메일</span>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-line bg-white px-3.5 py-2.5 text-[14.5px] outline-none transition-colors focus:border-ink"
              />
            </label>

            <label className="block">
              <span className="text-[13.5px] font-bold">비밀번호</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-line bg-white px-3.5 py-2.5 text-[14.5px] outline-none transition-colors focus:border-ink"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="btn btn-solid btn-lg w-full disabled:opacity-50"
            >
              {busy ? '로그인 중...' : '이메일로 로그인'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
