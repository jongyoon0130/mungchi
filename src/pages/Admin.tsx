import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminGate } from '../components/AdminGate'
import { Icon } from '../components/Icon'
import { Thumb } from '../components/Thumb'
import { useLots } from '../lib/useLots'
import { store } from '../lib/store'
import { signOut, useAdmin } from '../lib/auth'
import { isServerConfigured } from '../lib/supabase'
import { discountRate, pricePerPiece } from '../data/lots'
import { categoryMap } from '../data/categories'
import { gradeLabel, krw, manwon } from '../lib/format'
import type { Lot, LotStatus } from '../data/types'

const statusLabel: Record<LotStatus, string> = {
  available: '판매 중',
  reserved: '예약중',
  sold: '판매완료',
}

const statusStyle: Record<LotStatus, string> = {
  available: 'bg-rust/10 text-rust',
  reserved: 'bg-olive/12 text-olive',
  sold: 'bg-paper-deep text-ink-muted',
}

export default function Admin() {
  return (
    <AdminGate>
      <AdminList />
    </AdminGate>
  )
}

function AdminList() {
  const { data: lots, loading, error, reload } = useLots()
  const admin = useAdmin()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function changeStatus(lot: Lot, status: LotStatus) {
    setBusyId(lot.id)
    setActionError(null)
    try {
      await store.update(lot.id, { status })
      reload()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  async function remove(lot: Lot) {
    if (
      !confirm(`${lot.title}\n\n정말 지우시겠습니까? 사진과 영상도 함께 지워집니다.`)
    )
      return
    setBusyId(lot.id)
    setActionError(null)
    try {
      await store.remove(lot.id)
      reload()
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <nav className="text-[13px] text-ink-muted">
            <Link to="/" className="hover:text-ink">
              홈
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink">묶음 관리</span>
          </nav>
          <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.035em] sm:text-[38px]">
            묶음 관리
          </h1>
          <p className="mt-2 text-[14.5px] text-ink-muted">
            {loading
              ? '불러오고 있습니다...'
              : `등록된 묶음 ${lots.length}개`}
            {admin.email && ` · ${admin.email}`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isServerConfigured && (
            <button
              onClick={signOut}
              className="h-11 rounded-full border border-line bg-white px-5 text-[14.5px] font-semibold transition-colors hover:border-ink/30"
            >
              로그아웃
            </button>
          )}
          <Link
            to="/register"
            className="flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14.5px] font-semibold text-paper transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Icon name="plus" className="size-4" strokeWidth={2.4} />새 묶음 등록
          </Link>
        </div>
      </div>

      {(error || actionError) && (
        <p className="mt-6 rounded-card border border-rust/30 bg-rust/8 px-5 py-4 text-[13.5px] font-semibold text-rust">
          {error ?? actionError}
        </p>
      )}

      {!loading && lots.length === 0 ? (
        <div className="mt-8 rounded-card border border-line bg-white px-6 py-16 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-paper-deep text-ink-muted">
            <Icon name="camera" className="size-7" />
          </span>
          <h2 className="mt-6 text-[19px] font-bold tracking-[-0.025em]">
            아직 등록한 묶음이 없습니다
          </h2>
          <p className="mt-2.5 text-[14.5px] text-ink-soft">
            사진을 찍으셨다면 지금 첫 묶음을 올려 보세요.
          </p>
          <Link
            to="/register"
            className="mt-7 inline-flex h-12 items-center gap-1.5 rounded-full bg-rust px-6 text-[15px] font-bold text-white"
          >
            <Icon name="plus" className="size-4" strokeWidth={2.4} />첫 묶음 등록하기
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-2.5">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className={`flex flex-wrap items-center gap-4 rounded-card border border-line bg-white p-4 transition-opacity ${
                busyId === lot.id ? 'opacity-50' : ''
              }`}
            >
              <Link
                to={`/bundles/${lot.id}`}
                className="relative size-16 shrink-0 overflow-hidden rounded-xl"
              >
                <Thumb lot={lot} />
                {lot.video && (
                  <span className="absolute bottom-1 right-1 flex size-4 items-center justify-center rounded-full bg-ink/75 text-paper">
                    <Icon name="play" className="size-2" />
                  </span>
                )}
              </Link>

              <div className="min-w-48 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-ink-muted tnum">
                    {lot.id}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyle[lot.status]}`}
                  >
                    {statusLabel[lot.status]}
                  </span>
                </div>
                <Link
                  to={`/bundles/${lot.id}`}
                  className="mt-1 block text-[15px] font-semibold leading-snug hover:text-rust"
                >
                  {lot.title}
                </Link>
                <p className="mt-0.5 text-[12.5px] text-ink-muted tnum">
                  {categoryMap.get(lot.category)?.name}
                  {lot.brand ? ` · ${lot.brand}` : ''} · {gradeLabel[lot.grade]}{' '}
                  · {lot.pieces}장 · 사진 {lot.photos.length}장 · 영상{' '}
                  {lot.video ? '있음' : '없음'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[16px] font-bold tracking-tight tnum">
                  {manwon(lot.price)}
                </p>
                <p className="text-[12px] text-ink-muted tnum">
                  개당 {krw(pricePerPiece(lot))}
                  {discountRate(lot) > 0 && ` · ${discountRate(lot)}% 할인`}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={lot.status}
                  onChange={(e) =>
                    changeStatus(lot, e.target.value as LotStatus)
                  }
                  disabled={busyId === lot.id}
                  aria-label={`${lot.title} 판매 상태`}
                  className="h-10 rounded-full border border-line bg-white px-3 text-[13px] font-semibold outline-none focus:border-ink"
                >
                  <option value="available">판매 중</option>
                  <option value="reserved">예약중</option>
                  <option value="sold">판매완료</option>
                </select>
                <button
                  onClick={() => remove(lot)}
                  disabled={busyId === lot.id}
                  aria-label={`${lot.title} 지우기`}
                  className="flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-rust/40 hover:bg-rust/8 hover:text-rust"
                >
                  <Icon name="close" className="size-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
