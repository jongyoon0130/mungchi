/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase 프로젝트 URL. 없으면 연습 모드로 동작한다 */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon key. 공개돼도 되는 키다 */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
