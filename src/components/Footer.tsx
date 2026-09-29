import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { site } from '../config'

export function Footer() {
  return (
    <footer className="bg-sage">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-soft">
              검품하고 사진·영상까지 찍은 구제 의류 묶음을 정찰가로 거래합니다.
              첫 묶음을 준비하고 있습니다.
            </p>
            {site.contactEmail ? (
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-5 inline-block text-[14px] text-ink underline underline-offset-4"
              >
                {site.contactEmail}
              </a>
            ) : (
              <p className="mt-5 text-[13px] text-ink-muted">
                문의 창구는 준비 중입니다.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-[14px] font-extrabold">도매업체</h3>
            <ul className="mt-4 space-y-2.5">
              <FooterLink to="/sell">도매업체 입점</FooterLink>
              <FooterLink to="/register">새 묶음 등록</FooterLink>
              <FooterLink to="/admin">내 묶음 관리</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-[14px] font-extrabold">소매업체</h3>
            <ul className="mt-4 space-y-2.5">
              <FooterLink to="/bundles">전체 상품</FooterLink>
              <FooterLink to="/signup">소매업체 가입</FooterLink>
              <FooterLink to="/#how">이용안내</FooterLink>
              <FooterLink to="/#contact">문의</FooterLink>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-[14px] text-ink-soft transition-colors hover:text-ink"
      >
        {children}
      </Link>
    </li>
  )
}
