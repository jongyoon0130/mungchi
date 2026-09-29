import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAdmin } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'
import { SellerAuthButtons } from './SellerAuthButtons'
import { Logo } from './Logo'
import { Icon } from './Icon'

const nav = [
  { to: '/bundles', label: '전체 상품' },
  { to: '/#how', label: '이용 안내' },
  { to: '/#contact', label: '문의' },
]

function sellerLoggedIn(admin: ReturnType<typeof useAdmin>) {
  return isServerConfigured && admin.ready && !admin.needsLogin
}

const linkClass =
  'text-[14px] font-medium text-ink-soft transition-colors hover:text-ink'

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const admin = useAdmin()
  const loggedIn = sellerLoggedIn(admin)

  useEffect(() => setOpen(false), [location])

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="shell flex h-16 items-center gap-8 lg:h-[68px]">
        <Link to="/" className="shrink-0" aria-label="뭉치 홈">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/bundles'}
              className={({ isActive }) =>
                `${linkClass} ${
                  isActive && item.to === '/bundles' ? 'text-ink' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <div className="hidden items-center gap-5 sm:flex">
            <SellerAuthButtons admin={admin} plain />
            {loggedIn ? (
              <>
                <Link to="/admin" className={linkClass}>
                  묶음 관리
                </Link>
                <Link to="/register" className={linkClass}>
                  새 묶음 등록
                </Link>
              </>
            ) : (
              <>
                <Link to="/sell" className={linkClass}>
                  도매업체 가입
                </Link>
                <Link to="/signup" className={linkClass}>
                  소매업체 가입
                </Link>
              </>
            )}
          </div>
          <Link
            to="/bundles"
            className="hidden text-ink md:flex"
            aria-label="전체 상품"
          >
            <Icon name="search" className="size-[18px]" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 items-center justify-center text-ink md:hidden"
            aria-label="메뉴"
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white md:hidden">
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
                  <Link to="/admin" className="btn btn-line w-full">
                    묶음 관리
                  </Link>
                  <Link to="/register" className="btn btn-solid w-full">
                    새 묶음 등록
                  </Link>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn btn-solid flex-1">
                    로그인
                  </Link>
                  <Link to="/sell" className="btn btn-line flex-1">
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
