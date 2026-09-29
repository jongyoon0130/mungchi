import { Link } from 'react-router-dom'
import type { AdminState } from '../lib/auth'
import { signOut } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'

type Props = {
  admin: AdminState
  plain?: boolean
}

/** 헤더에 항상 보이는 판매자 로그인 / 로그아웃 */
export function SellerAuthButtons({ admin, plain = false }: Props) {
  if (!isServerConfigured || !admin.ready) return null

  const text =
    'text-[14px] font-medium text-ink-soft transition-colors hover:text-ink'

  if (!admin.needsLogin) {
    return (
      <div className="flex items-center gap-3">
        {admin.email && (
          <span
            className="hidden max-w-[140px] truncate text-[13px] text-ink-muted lg:block"
            title={admin.email}
          >
            {admin.email}
          </span>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          className={plain ? text : 'btn btn-line'}
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <Link to="/login" className={plain ? text : 'btn btn-line'}>
      로그인
    </Link>
  )
}
