import type { Lot, LotInput, LotStatus } from '../data/types'
import type { LotStore } from './store'
import { MEDIA_BUCKET, requireSupabase } from './supabase'

/** DB 컬럼은 snake_case, 앱 안에서는 camelCase를 쓴다 */
type Row = {
  id: string
  title: string
  summary: string
  department: string
  category: string
  brand: string
  grade: string
  season: string
  pieces: number
  weight_kg: number
  origin: string
  contents: string[]
  condition_notes: string
  photos: string[]
  video: string | null
  price: number
  list_price: number | null
  free_shipping: boolean
  status: string
  listed_at: string
}

function toLot(row: Row): Lot {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    department: row.department as Lot['department'],
    category: row.category as Lot['category'],
    brand: row.brand ?? '',
    grade: row.grade as Lot['grade'],
    season: row.season as Lot['season'],
    pieces: row.pieces,
    weightKg: Number(row.weight_kg),
    origin: row.origin,
    contents: row.contents ?? [],
    conditionNotes: row.condition_notes ?? '',
    photos: row.photos ?? [],
    video: row.video ?? undefined,
    price: row.price,
    listPrice: row.list_price ?? undefined,
    freeShipping: row.free_shipping,
    status: row.status as LotStatus,
    listedAt: row.listed_at,
  }
}

function toRow(input: Partial<LotInput>) {
  const row: Record<string, unknown> = {}
  if (input.id !== undefined) row.id = input.id
  if (input.title !== undefined) row.title = input.title
  if (input.summary !== undefined) row.summary = input.summary
  if (input.department !== undefined) row.department = input.department
  if (input.category !== undefined) row.category = input.category
  if (input.brand !== undefined) row.brand = input.brand
  if (input.grade !== undefined) row.grade = input.grade
  if (input.season !== undefined) row.season = input.season
  if (input.pieces !== undefined) row.pieces = input.pieces
  if (input.weightKg !== undefined) row.weight_kg = input.weightKg
  if (input.origin !== undefined) row.origin = input.origin
  if (input.contents !== undefined) row.contents = input.contents
  if (input.conditionNotes !== undefined)
    row.condition_notes = input.conditionNotes
  if (input.price !== undefined) row.price = input.price
  if (input.listPrice !== undefined) row.list_price = input.listPrice ?? null
  if (input.freeShipping !== undefined) row.free_shipping = input.freeShipping
  if (input.status !== undefined) row.status = input.status
  if (input.listedAt !== undefined) row.listed_at = input.listedAt
  return row
}

/** 파일명에 한글이나 공백이 있으면 URL이 깨지므로 안전한 이름으로 바꾼다 */
function safeExt(name: string, fallback: string): string {
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : ''
  return /^[a-z0-9]{2,5}$/.test(ext) ? ext : fallback
}

export const supabaseStore: LotStore = {
  mode: 'supabase',

  async list() {
    const { data, error } = await requireSupabase()
      .from('lots')
      .select('*')
      .order('listed_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as Row[]).map(toLot)
  },

  async get(id) {
    const { data, error } = await requireSupabase()
      .from('lots')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? toLot(data as Row) : null
  },

  async create(input: LotInput, photos: File[], video?: File | null) {
    const client = requireSupabase()

    // 파일을 먼저 올린다. 실패하면 빈 묶음이 남지 않는다.
    const uploaded: string[] = []

    async function put(file: File, path: string): Promise<string> {
      const { error } = await client.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })
      if (error) throw new Error(`${file.name} 업로드 실패: ${error.message}`)
      uploaded.push(path)
      return client.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
    }

    async function cleanUp() {
      if (uploaded.length) {
        await client.storage.from(MEDIA_BUCKET).remove(uploaded)
      }
    }

    let photoUrls: string[] = []
    let videoUrl: string | null = null

    try {
      photoUrls = []
      for (const [i, file] of photos.entries()) {
        const name = `${String(i + 1).padStart(2, '0')}.${safeExt(file.name, 'jpg')}`
        photoUrls.push(await put(file, `${input.id}/${name}`))
      }
      if (video) {
        videoUrl = await put(
          video,
          `${input.id}/video.${safeExt(video.name, 'mp4')}`,
        )
      }
    } catch (err) {
      await cleanUp()
      throw err
    }

    const { data, error } = await client
      .from('lots')
      .insert({ ...toRow(input), photos: photoUrls, video: videoUrl })
      .select()
      .single()

    if (error) {
      // 묶음이 안 들어갔으면 올려 둔 파일도 치운다
      await cleanUp()
      throw new Error(
        error.code === '23505'
          ? `묶음 번호 ${input.id}는 이미 있습니다.`
          : error.message,
      )
    }
    return toLot(data as Row)
  },

  async update(id, patch) {
    const { data, error } = await requireSupabase()
      .from('lots')
      .update(toRow(patch))
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return toLot(data as Row)
  },

  async remove(id) {
    const client = requireSupabase()

    // 파일부터 지운다. 묶음만 지우면 저장소에 쓰레기가 남는다.
    const { data: files } = await client.storage.from(MEDIA_BUCKET).list(id)
    if (files?.length) {
      await client.storage
        .from(MEDIA_BUCKET)
        .remove(files.map((f) => `${id}/${f.name}`))
    }

    const { error } = await client.from('lots').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
