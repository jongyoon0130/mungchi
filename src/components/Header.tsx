import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAdmin } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'
import { SellerAuthButtons } from './SellerAuthButtons'
import { Logo } from './Logo'
import { Icon } from './Icon'

const nav = [
  { to: '/bundles', label: '판매 중 묶음' },
  { to: '/#how', label: '거래 방식' },
  { to: '/#faq', label: '자주 묻는 질문' },
]

function sellerLoggedIn(admin: ReturnType<typeof useAdmin>) {
  return isServerConfigured && admin.ready && !admin.needsLogin
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const admin = useAdmin()
  const loggedIn = sellerLoggedIn(admin)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지가 바뀌면 모바일 메뉴는 닫혀 있어야 한다
  useEffect(() => setOpen(false), [location])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? 'border-line bg-paper/90 backdrop-blur-md'
          : 'border-transparent bg-paper'
      }`}
    >
      <div className="shell flex h-16 items-center gap-8">
        <Link to="/" className="shrink-0" aria-label="뭉치 홈">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-[14.5px] font-medium transition-colors hover:text-ink ${
                  isActive && item.to === '/bundles'
                    ? 'text-ink'
                    : 'text-ink-soft'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SellerAuthButtons admin={admin} />
          {loggedIn ? (
            <>
              <Link
                to="/admin"
                className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-semibold transition-colors hover:border-ink/30 sm:flex"
              >
                <Icon name="shield" className="size-4" />
                묶음 관리
              </Link>
              <Link
                to="/register"
                className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-semibold transition-colors hover:border-ink/30 md:flex"
              >
                <Icon name="plus" className="size-4" strokeWidth={2.4} />
                새 묶음 등록
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/sell"
                className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-semibold transition-colors hover:border-ink/30 sm:flex"
              >
                <Icon name="store" className="size-4" />
                도매업체 입점
              </Link>
              <Link
                to="/signup"
                className="hidden h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-semibold transition-colors hover:border-ink/30 md:flex"
              >
                <Icon name="cart" className="size-4" />
                소매업체 가입
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep lg:hidden"
            aria-label="메뉴"
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper lg:hidden">
          <div className="shell flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="border-b border-line-soft py-3.5 text-[15px] font-medium text-ink-soft"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 py-3">
              <div className="flex justify-end px-1">
                <SellerAuthButtons admin={admin} />
              </div>
              {loggedIn ? (
                <>
                  <Link
                    to="/admin"
                    className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-[14.5px] font-semibold"
                  >
                    <Icon name="shield" className="size-4" />
                    묶음 관리
                  </Link>
                  <Link
                    to="/register"
                    className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-[14.5px] font-semibold"
                  >
                    <Icon name="plus" className="size-4" strokeWidth={2.4} />새
                    묶음 등록
                  </Link>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex h-11 flex-1 items-center justify-center rounded-full bg-ink text-[14.5px] font-semibold text-paper"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/sell"
                    className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-white text-[14.5px] font-semibold"
                  >
                    <Icon name="store" className="size-4" />
                    입점
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
