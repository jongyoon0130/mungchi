import { Navigate } from 'react-router-dom'
import { SellerLoginPanel } from '../components/SellerLoginPanel'
import { useAdmin } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'

/** 판매자(도매) 구글·이메일 로그인 전용 페이지 */
export default function Login() {
  const admin = useAdmin()

  if (!isServerConfigured) {
    return <Navigate to="/sell" replace />
  }

  if (!admin.ready) {
    return (
      <div className="shell py-32 text-center text-[14.5px] text-ink-muted">
        확인하고 있습니다...
      </div>
    )
  }

  if (!admin.needsLogin) {
    return <Navigate to="/register" replace />
  }

  return <SellerLoginPanel />
}
