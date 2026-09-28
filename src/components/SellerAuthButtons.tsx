import { Link } from 'react-router-dom'
import type { AdminState } from '../lib/auth'
import { signOut } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'

type Props = {
  admin: AdminState
}

/** 헤더에 항상 보이는 판매자 로그인 / 로그아웃 */
export function SellerAuthButtons({ admin }: Props) {
  if (!isServerConfigured || !admin.ready) return null

  if (!admin.needsLogin) {
    return (
      <div className="flex items-center gap-2">
        {admin.email && (
          <span
            className="hidden max-w-[120px] truncate text-[13px] text-ink-muted lg:block"
            title={admin.email}
          >
            {admin.email}
          </span>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex h-10 shrink-0 items-center justify-center rounded-full border border-rust/35 bg-white px-4 text-[14px] font-semibold text-rust transition-colors hover:border-rust/55 hover:bg-rust/5"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/login"
      className="flex h-10 shrink-0 items-center justify-center rounded-full bg-ink px-4 text-[14px] font-semibold text-paper transition-transform hover:scale-[1.02] active:scale-95"
    >
      로그인
    </Link>
  )
}
