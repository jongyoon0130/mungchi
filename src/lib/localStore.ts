import type { Lot, LotInput } from '../data/types'
import type { LotStore } from './store'

/**
 * 연습 모드 저장소.
 *
 * 서버를 아직 붙이지 않았을 때 쓴다. IndexedDB에 저장하므로 새로고침해도
 * 남아 있지만 이 브라우저 안에만 있다. 다른 사람은 볼 수 없다.
 * 사진과 영상은 원본 파일을 그대로 넣어 두고, 읽을 때 임시 URL을 만들어 쓴다.
 */

const DB_NAME = 'mungchi'
/** 2로 올린 이유: 영상 칸이 생겨서 예전에 저장한 경매 데이터와 구조가 다르다 */
const DB_VERSION = 2
const LOTS = 'lots'
const MEDIA = 'photos'

type StoredLot = Omit<Lot, 'photos' | 'video'> & {
  photoKeys: string[]
  videoKey?: string
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      // 경매 시절 데이터는 컬럼이 아예 달라서 되살릴 수 없다. 비우고 시작한다.
      if (db.objectStoreNames.contains(LOTS)) db.deleteObjectStore(LOTS)
      if (db.objectStoreNames.contains(MEDIA)) db.deleteObjectStore(MEDIA)
      db.createObjectStore(LOTS, { keyPath: 'id' })
      db.createObjectStore(MEDIA)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function run<T>(
  store: IDBObjectStore,
  action: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = action(store)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStores<T>(
  names: string[],
  mode: IDBTransactionMode,
  fn: (stores: IDBObjectStore[]) => Promise<T>,
): Promise<T> {
  const db = await openDb()
  try {
    const tx = db.transaction(names, mode)
    const result = await fn(names.map((n) => tx.objectStore(n)))
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
    return result
  } finally {
    db.close()
  }
}

/**
 * Blob으로 만든 임시 URL은 페이지를 벗어나면 못 쓴다. 같은 파일을 여러 번
 * 읽을 때 URL이 계속 새로 생기지 않게 캐시해 둔다.
 */
const urlCache = new Map<string, string>()

async function urlFor(
  key: string,
  mediaStore: IDBObjectStore,
): Promise<string | undefined> {
  const cached = urlCache.get(key)
  if (cached) return cached
  const blob = await run<Blob | undefined>(mediaStore, (s) => s.get(key))
  if (!blob) return undefined
  const objectUrl = URL.createObjectURL(blob)
  urlCache.set(key, objectUrl)
  return objectUrl
}

async function toLot(stored: StoredLot, mediaStore: IDBObjectStore) {
  const photos: string[] = []
  for (const key of stored.photoKeys) {
    const url = await urlFor(key, mediaStore)
    if (url) photos.push(url)
  }
  const video = stored.videoKey
    ? await urlFor(stored.videoKey, mediaStore)
    : undefined

  const { photoKeys: _photoKeys, videoKey: _videoKey, ...rest } = stored
  return { ...rest, photos, video } as Lot
}

export const localStore: LotStore = {
  mode: 'local',

  async list() {
    return withStores([LOTS, MEDIA], 'readonly', async ([lotStore, mediaStore]) => {
      const rows = await run<StoredLot[]>(lotStore, (s) => s.getAll())
      const lots: Lot[] = []
      for (const row of rows) lots.push(await toLot(row, mediaStore))
      return lots.sort((a, b) => b.listedAt.localeCompare(a.listedAt))
    })
  },

  async get(id) {
    return withStores([LOTS, MEDIA], 'readonly', async ([lotStore, mediaStore]) => {
      const row = await run<StoredLot | undefined>(lotStore, (s) => s.get(id))
      return row ? await toLot(row, mediaStore) : null
    })
  },

  async create(input: LotInput, photos: File[], video?: File | null) {
    return withStores([LOTS, MEDIA], 'readwrite', async ([lotStore, mediaStore]) => {
      const existing = await run<StoredLot | undefined>(lotStore, (s) =>
        s.get(input.id),
      )
      if (existing) {
        throw new Error(`묶음 번호 ${input.id}는 이미 있습니다.`)
      }

      const photoKeys: string[] = []
      for (const [i, file] of photos.entries()) {
        const key = `${input.id}/${String(i + 1).padStart(2, '0')}-${file.name}`
        await run(mediaStore, (s) => s.put(file, key))
        photoKeys.push(key)
      }

      let videoKey: string | undefined
      if (video) {
        videoKey = `${input.id}/video-${video.name}`
        await run(mediaStore, (s) => s.put(video, videoKey!))
      }

      const stored: StoredLot = { ...input, photoKeys, videoKey }
      await run(lotStore, (s) => s.put(stored))
      return toLot(stored, mediaStore)
    })
  },

  async update(id, patch) {
    return withStores([LOTS, MEDIA], 'readwrite', async ([lotStore, mediaStore]) => {
      const row = await run<StoredLot | undefined>(lotStore, (s) => s.get(id))
      if (!row) throw new Error('묶음을 찾을 수 없습니다.')
      const next = { ...row, ...patch }
      await run(lotStore, (s) => s.put(next))
      return toLot(next, mediaStore)
    })
  },

  async remove(id) {
    await withStores([LOTS, MEDIA], 'readwrite', async ([lotStore, mediaStore]) => {
      const row = await run<StoredLot | undefined>(lotStore, (s) => s.get(id))
      if (row) {
        const keys = [...row.photoKeys, row.videoKey].filter(Boolean) as string[]
        for (const key of keys) {
          await run(mediaStore, (s) => s.delete(key))
          const cached = urlCache.get(key)
          if (cached) {
            URL.revokeObjectURL(cached)
            urlCache.delete(key)
          }
        }
      }
      await run(lotStore, (s) => s.delete(id))
    })
  },
}
