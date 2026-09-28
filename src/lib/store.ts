import type { Lot, LotInput } from '../data/types'
import { isServerConfigured } from './supabase'
import { localStore } from './localStore'
import { supabaseStore } from './supabaseStore'

export type StoreMode = 'supabase' | 'local'

export interface LotStore {
  /** 지금 어디에 저장하고 있는지. 화면에 표시해서 헷갈리지 않게 한다 */
  readonly mode: StoreMode
  list(): Promise<Lot[]>
  get(id: string): Promise<Lot | null>
  /** 영상은 없을 수 있다. 사진은 최소 한 장 받는다 */
  create(input: LotInput, photos: File[], video?: File | null): Promise<Lot>
  update(id: string, patch: Partial<LotInput>): Promise<Lot>
  remove(id: string): Promise<void>
}

/**
 * .env에 Supabase 키가 있으면 실제 서버를, 없으면 이 브라우저에만 저장하는
 * 연습 모드를 쓴다. 화면 쪽 코드는 어느 쪽인지 신경 쓸 필요가 없다.
 */
export const store: LotStore = isServerConfigured ? supabaseStore : localStore

export const isPracticeMode = store.mode === 'local'
