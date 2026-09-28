import { SellerLoginPanel } from './SellerLoginPanel'
import { useAdmin } from '../lib/auth'
import { isPracticeMode } from '../lib/store'
import { Icon } from './Icon'

/**
 * 관리자 화면을 감싸는 껍데기.
 *
 * 서버를 붙였으면 로그인을 요구하고, 연습 모드면 그냥 통과시킨다.
 * 어느 쪽인지 위에 띠로 알려줘서 지금 어디에 저장되는지 헷갈리지 않게 한다.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = useAdmin()

  if (!admin.ready) {
    return (
      <div className="shell py-32 text-center text-[14.5px] text-ink-muted">
        확인하고 있습니다...
      </div>
    )
  }

  if (admin.needsLogin) return <SellerLoginPanel />

  return (
    <>
      {isPracticeMode && <PracticeBanner />}
      {children}
    </>
  )
}

function PracticeBanner() {
  return (
    <div className="border-b border-sand bg-sand/35">
      <div className="shell flex items-start gap-2.5 py-3">
        <Icon name="shield" className="mt-0.5 size-4 shrink-0 text-ink-soft" />
        <p className="text-[13px] leading-relaxed text-ink-soft">
          <strong className="font-bold text-ink">연습 모드입니다.</strong> 등록한
          묶음은 이 브라우저에만 저장되고 다른 사람은 볼 수 없습니다. 실제로
          공개하려면 서버를 연결해야 합니다. 방법은 README에 적어 뒀습니다.
        </p>
      </div>
    </div>
  )
}
