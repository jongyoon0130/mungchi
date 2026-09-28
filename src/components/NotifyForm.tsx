import { useState } from 'react'
import { site } from '../config'
import { Icon } from './Icon'

/**
 * 첫 묶음 알림 신청. 아직 서버가 없으니 메일 클라이언트를 열어
 * 우리 주소로 메일을 보내게 한다. 백엔드가 붙으면 여기만 고치면 된다.
 */
export function NotifyForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (!site.contactEmail) {
    return (
      <p
        className={`text-[13.5px] ${dark ? 'text-paper/55' : 'text-ink-muted'}`}
      >
        알림 신청 창구를 준비하고 있습니다. 조금만 기다려 주세요.
      </p>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    const subject = encodeURIComponent('첫 묶음 알림 신청')
    const body = encodeURIComponent(
      `첫 묶음이 올라오면 알려주세요.\n\n연락받을 이메일: ${email}`,
    )
    window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`
    setSent(true)
  }

  if (sent) {
    return (
      <p
        className={`flex items-center gap-2 text-[14px] font-semibold ${
          dark ? 'text-paper' : 'text-olive'
        }`}
      >
        <Icon name="check" className="size-4" strokeWidth={2.6} />
        메일 앱이 열렸습니다. 보내기만 누르시면 접수됩니다.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md items-center gap-2 rounded-full border p-1.5 ${
        dark ? 'border-paper/20 bg-white/10' : 'border-line bg-white'
      }`}
    >
      <Icon
        name="mail"
        className={`ml-3 size-[18px] shrink-0 ${
          dark ? 'text-paper/50' : 'text-ink-muted'
        }`}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소"
        className={`min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none ${
          dark
            ? 'text-paper placeholder:text-paper/45'
            : 'placeholder:text-ink-muted'
        }`}
      />
      <button
        type="submit"
        className={`h-10 shrink-0 rounded-full px-5 text-[14.5px] font-semibold transition-transform hover:scale-[1.03] active:scale-95 ${
          dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
        }`}
      >
        알림 받기
      </button>
    </form>
  )
}
