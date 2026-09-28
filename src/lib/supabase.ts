import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase 연결.
 *
 * `.env` 파일에 아래 두 줄이 있으면 실제 서버를 쓰고, 없으면 연습 모드로
 * 이 컴퓨터에만 저장한다. 설정 방법은 README에 있다.
 *
 *   VITE_SUPABASE_URL=...
 *   VITE_SUPABASE_ANON_KEY=...
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isServerConfigured = Boolean(url && anonKey)

/** 사진과 영상을 올려 둘 Storage 버킷 이름 */
export const MEDIA_BUCKET = 'lot-photos'

/** 영상 한 편의 최대 용량. 스키마의 버킷 상한과 같은 값이어야 한다 */
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024

export const supabase: SupabaseClient | null = isServerConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null

/** 서버가 설정되지 않은 곳에서 실수로 호출했을 때 바로 알아차리게 */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase가 설정되지 않았습니다. .env에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 넣어 주세요.',
    )
  }
  return supabase
}
