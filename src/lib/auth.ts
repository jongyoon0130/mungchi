import { useEffect, useState } from 'react'
import { isServerConfigured, supabase } from './supabase'

/**
 * 관리자 로그인.
 *
 * 서버를 붙였을 때만 로그인을 요구한다. 연습 모드는 이 브라우저에만 저장되니
 * 굳이 막을 게 없다.
 */

export type AdminState = {
  /** 세션 확인이 끝났는지. 끝나기 전에 화면을 그리면 깜빡인다 */
  ready: boolean
  email: string | null
  /** 로그인해야 등록 화면을 쓸 수 있는 상태인지 */
  needsLogin: boolean
}

export function useAdmin(): AdminState {
  const [state, setState] = useState<AdminState>(() =>
    isServerConfigured
      ? { ready: false, email: null, needsLogin: true }
      : { ready: true, email: null, needsLogin: false },
  )

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setState({
        ready: true,
        email: data.session?.user.email ?? null,
        needsLogin: !data.session,
      })
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        ready: true,
        email: session?.user.email ?? null,
        needsLogin: !session,
      })
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return state
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('서버가 설정되지 않았습니다.')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) {
    throw new Error(
      error.message.includes('provider is not enabled')
        ? '구글 로그인이 아직 켜져 있지 않습니다. Supabase Authentication > Providers에서 Google을 켜 주세요.'
        : error.message,
    )
  }
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('서버가 설정되지 않았습니다.')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(
      error.message === 'Invalid login credentials'
        ? '이메일이나 비밀번호가 맞지 않습니다.'
        : error.message,
    )
  }
}

export async function signOut() {
  await supabase?.auth.signOut()
}
