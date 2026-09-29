import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Field,
  FormSection,
  NumberInput,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from '../components/Field'
import { Icon } from '../components/Icon'
import { LotCard } from '../components/LotCard'
import { AdminGate } from '../components/AdminGate'
import { categories, departments } from '../data/categories'
import { nextLotId } from '../data/lots'
import { useLots } from '../lib/useLots'
import { signOut, useAdmin } from '../lib/auth'
import { store } from '../lib/store'
import { isServerConfigured, MAX_VIDEO_BYTES } from '../lib/supabase'
import { sellingRules } from '../config'
import { krw } from '../lib/format'
import type {
  CategoryId,
  DepartmentId,
  Grade,
  Lot,
  LotStatus,
  Season,
} from '../data/types'

const gradeOptions: { value: Grade; label: string }[] = [
  { value: 'A', label: 'A급 — 하자 없음, 바로 판매 가능' },
  { value: 'B', label: 'B급 — 사용감 있음, 세탁·수선 권장' },
  { value: 'MIX', label: '믹스 — A급과 B급 섞임, 단가 우선' },
]

const seasonOptions: { value: Season; label: string }[] = [
  { value: '사계절', label: '사계절' },
  { value: '봄·가을', label: '봄·가을' },
  { value: '여름', label: '여름' },
  { value: '겨울', label: '겨울' },
]

const statusOptions: { value: LotStatus; label: string }[] = [
  { value: 'available', label: '판매 중 — 바로 살 수 있게' },
  { value: 'reserved', label: '예약중 — 입금 확인 중' },
  { value: 'sold', label: '판매완료 — 지난 기록' },
]

/** 바이트를 MB로 */
function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export default function RegisterLot() {
  return (
    <AdminGate>
      <RegisterForm />
    </AdminGate>
  )
}

function RegisterForm() {
  const navigate = useNavigate()
  const admin = useAdmin()
  const { data: existingLots, loading: loadingLots } = useLots()

  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [department, setDepartment] = useState<DepartmentId>('unisex')
  const [category, setCategory] = useState<CategoryId>('outer')
  const [brand, setBrand] = useState('')
  const [grade, setGrade] = useState<Grade>('A')
  const [season, setSeason] = useState<Season>('사계절')
  const [origin, setOrigin] = useState('')

  const [pieces, setPieces] = useState('')
  const [weightKg, setWeightKg] = useState('')

  const [contents, setContents] = useState('')
  const [conditionNotes, setConditionNotes] = useState('')

  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')

  const [price, setPrice] = useState('')
  const [listPrice, setListPrice] = useState('')
  const [freeShipping, setFreeShipping] = useState(false)
  const [status, setStatus] = useState<LotStatus>('available')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // 묶음 번호는 이미 등록된 것들을 보고 다음 번호를 넣는다
  useEffect(() => {
    if (!loadingLots && !id) setId(nextLotId(existingLots))
  }, [loadingLots, existingLots, id])

  // 미리보기로 만든 임시 URL은 화면을 떠날 때 돌려줘야 메모리가 새지 않는다
  useEffect(() => {
    return () => photoPreviews.forEach((url) => URL.revokeObjectURL(url))
  }, [photoPreviews])

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview)
    }
  }, [videoPreview])

  const contentLines = contents
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const piecesNum = Number(pieces) || 0
  const priceNum = Number(price) || 0
  const listPriceNum = Number(listPrice) || 0

  const discount =
    listPriceNum > priceNum && priceNum > 0
      ? Math.round((1 - priceNum / listPriceNum) * 100)
      : 0

  const preview = useMemo<Lot>(
    () => ({
      id: id || 'L-000',
      title: title || '제목을 입력하세요',
      summary,
      department,
      category,
      brand,
      grade,
      season,
      pieces: piecesNum || 1,
      weightKg: Number(weightKg) || 0,
      origin: origin || '매입처',
      contents: contentLines,
      conditionNotes,
      photos: photoPreviews,
      video: videoPreview || undefined,
      price: priceNum,
      listPrice: listPriceNum || undefined,
      freeShipping,
      status,
      listedAt: new Date().toISOString(),
    }),
    [
      id,
      title,
      summary,
      department,
      category,
      brand,
      grade,
      season,
      piecesNum,
      weightKg,
      origin,
      contentLines,
      conditionNotes,
      photoPreviews,
      videoPreview,
      priceNum,
      listPriceNum,
      freeShipping,
      status,
    ],
  )

  const missing = [
    !id && '묶음 번호',
    !title && '제목',
    !summary && '한 줄 소개',
    !origin && '매입처',
    !piecesNum && '장수',
    !Number(weightKg) && '총 중량',
    contentLines.length === 0 && '구성 내역',
    !priceNum && '판매가',
    photos.length === 0 && '사진',
  ].filter(Boolean) as string[]

  /** 값이 서로 어긋나는 경우. 안 채운 것과는 따로 보여준다 */
  const warnings = [
    listPriceNum > 0 &&
      priceNum > 0 &&
      listPriceNum <= priceNum &&
      '정가가 판매가보다 낮거나 같습니다. 할인 표시가 안 나옵니다.',
    video &&
      video.size > MAX_VIDEO_BYTES &&
      `영상이 ${mb(video.size)}입니다. ${mb(MAX_VIDEO_BYTES)}까지만 올라갑니다.`,
    existingLots.some((l) => l.id === id) &&
      `묶음 번호 ${id}는 이미 등록돼 있습니다`,
  ].filter(Boolean) as string[]

  const canSubmit = missing.length === 0 && warnings.length === 0 && !submitting

  function handlePhotos(files: FileList | null) {
    if (!files?.length) return
    photoPreviews.forEach((url) => URL.revokeObjectURL(url))
    const picked = Array.from(files)
    setPhotos(picked)
    setPhotoPreviews(picked.map((f) => URL.createObjectURL(f)))
  }

  function handleVideo(files: FileList | null) {
    if (videoPreview) URL.revokeObjectURL(videoPreview)
    const file = files?.[0] ?? null
    setVideo(file)
    setVideoPreview(file ? URL.createObjectURL(file) : '')
  }

  /** 판매가가 무료배송 기준을 넘으면 한 번만 켜 준다 */
  function handlePrice(value: string) {
    setPrice(value)
    if (Number(value) >= sellingRules.freeShippingOver && !freeShipping) {
      setFreeShipping(true)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await store.create(
        {
          id,
          title,
          summary,
          department,
          category,
          brand,
          grade,
          season,
          pieces: piecesNum,
          weightKg: Number(weightKg),
          origin,
          contents: contentLines,
          conditionNotes,
          price: priceNum,
          listPrice: listPriceNum || undefined,
          freeShipping,
          status,
          listedAt: new Date().toISOString(),
        },
        photos,
        video,
      )
      navigate(`/bundles/${id}`)
    } catch (err) {
      setSubmitError((err as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <div className="shell py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-1.5 text-[13px] text-ink-muted">
          <Link to="/sell" className="hover:text-ink">
            도매업체
          </Link>
          <span>/</span>
          <Link to="/admin" className="hover:text-ink">
            묶음 관리
          </Link>
          <span>/</span>
          <span className="text-ink">새 묶음 등록</span>
        </nav>
        {isServerConfigured && (
          <div className="flex items-center gap-2.5">
            {admin.email && (
              <span className="max-w-[180px] truncate text-[13px] text-ink-muted">
                {admin.email}
              </span>
            )}
            <button
              type="button"
              onClick={() => void signOut()}
              className="btn btn-line text-rust"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 max-w-2xl">
        <h1 className="text-[30px] font-extrabold tracking-[-0.035em] sm:text-[38px]">
          새 묶음 등록
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
          사진과 영상을 올리고 원하시는 가격을 적은 뒤 맨 아래 등록 버튼을
          누르면 바로 판매가 시작됩니다.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <div className="space-y-3.5">
          <FormSection
            step={1}
            title="사진과 영상"
            body="사진 첫 장이 대표 사진이 되고, 영상은 그 다음 두 번째 칸에 들어갑니다. 영상은 없어도 등록됩니다."
          >
            <Field
              label="사진 고르기"
              required
              hint="여러 장을 한 번에 고를 수 있습니다. 파일명 순서대로 들어갑니다."
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotos(e.target.files)}
                className="w-full cursor-pointer rounded-xl border border-dashed border-line bg-white px-3.5 py-3 text-[14px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-[13px] file:font-semibold file:text-paper"
              />
            </Field>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {photoPreviews.map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden border border-line"
                  >
                    <img
                      src={src}
                      alt={`사진 ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-bold text-paper">
                        대표
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Field
              label="영상 고르기"
              hint={`묶음을 넘겨 가며 찍은 영상 한 편. mp4·mov·webm, ${mb(MAX_VIDEO_BYTES)}까지.`}
            >
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => handleVideo(e.target.files)}
                className="w-full cursor-pointer rounded-xl border border-dashed border-line bg-white px-3.5 py-3 text-[14px] file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-1.5 file:text-[13px] file:font-semibold file:text-paper"
              />
            </Field>

            {videoPreview && video && (
              <div className="overflow-hidden rounded-xl border border-line bg-black">
                <video
                  src={videoPreview}
                  controls
                  playsInline
                  className="max-h-64 w-full object-contain"
                />
                <p className="bg-white px-3.5 py-2 text-[12.5px] text-ink-muted tnum">
                  {video.name} · {mb(video.size)}
                </p>
              </div>
            )}
          </FormSection>

          <FormSection
            step={2}
            title="기본 정보"
            body="목록과 상세 페이지 맨 위에 보이는 내용입니다."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="묶음 번호" required hint="자동으로 다음 번호가 들어갑니다">
                <TextInput value={id} onChange={setId} />
              </Field>
              <Field label="매입처" required hint="예: 일본 오사카, 국내 창고">
                <TextInput
                  value={origin}
                  onChange={setOrigin}
                  placeholder="일본 오사카"
                />
              </Field>
            </div>

            <Field
              label="제목"
              required
              hint="무엇이 몇 장 들어있는지 바로 알 수 있게. 예: 90s 브랜드 항공점퍼 20장"
            >
              <TextInput
                value={title}
                onChange={setTitle}
                placeholder="90s 브랜드 항공점퍼 믹스"
              />
            </Field>

            <Field
              label="한 줄 소개"
              required
              hint="왜 이 묶음이 괜찮은지 한 문장으로"
            >
              <TextInput
                value={summary}
                onChange={setSummary}
                placeholder="나이키·아디다스 새틴 자켓 위주로 골라 담은 묶음입니다"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="부문" required hint="상세 페이지의 '부문' 줄에 나옵니다">
                <Select
                  value={department}
                  onChange={setDepartment}
                  options={departments.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                />
              </Field>
              <Field
                label="카테고리"
                required
                hint="공개 화면에는 아직 안 나뉩니다. 상품이 늘면 필터에 씁니다."
              >
                <Select
                  value={category}
                  onChange={setCategory}
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              </Field>
            </div>

            <Field
              label="브랜드"
              hint="공개 필터에는 아직 안 나옵니다. 상품이 늘면 브랜드별 탐색에 씁니다. 여러 개면 쉼표로 적어 주세요."
            >
              <TextInput
                value={brand}
                onChange={setBrand}
                placeholder="나이키, 아디다스"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="시즌" required>
                <Select value={season} onChange={setSeason} options={seasonOptions} />
              </Field>
              <Field label="상태 등급" required>
                <Select value={grade} onChange={setGrade} options={gradeOptions} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            step={3}
            title="수량과 무게"
            body="개당 단가와 배송비를 계산하는 기준입니다. 실제 수량 그대로 적으세요."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="장수" required hint="묶음에 들어 있는 총 장수">
                <NumberInput
                  value={pieces}
                  onChange={setPieces}
                  placeholder="20"
                  suffix="장"
                />
              </Field>
              <Field label="총 중량" required hint="배송비 안내에 쓰입니다">
                <NumberInput
                  value={weightKg}
                  onChange={setWeightKg}
                  placeholder="14.2"
                  suffix="kg"
                  step="0.1"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            step={4}
            title="구성과 상태"
            body="사는 사람이 가장 많이 보는 부분입니다. 하자를 숨기지 않는 게 원칙입니다."
          >
            <Field
              label="구성 내역"
              required
              hint="한 줄에 하나씩 적으세요. 줄바꿈하면 항목이 나뉩니다."
            >
              <TextArea
                value={contents}
                onChange={setContents}
                rows={5}
                placeholder={
                  '나이키 · 아디다스 새틴 항공점퍼 8장\n미국 대학 로고 자켓 7장\n무지 · 마이너 브랜드 5장'
                }
              />
            </Field>

            <Field
              label="상태 특이사항"
              hint="얼룩, 구멍, 수선 필요한 부분을 미리 적으세요. 없으면 비워 두세요."
            >
              <TextArea
                value={conditionNotes}
                onChange={setConditionNotes}
                rows={3}
                placeholder="2장에 소매 끝 마감 풀림이 있고, 1장은 안감 얼룩이 있습니다."
              />
            </Field>
          </FormSection>

          <FormSection
            step={5}
            title="가격"
            body="여기 적은 값이 그대로 판매가가 됩니다. 사는 쪽은 이 값을 보고 살지 말지만 결정합니다."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="판매가"
                required
                hint="묶음 전체 가격입니다. 개당이 아닙니다."
              >
                <NumberInput
                  value={price}
                  onChange={handlePrice}
                  placeholder="500000"
                  suffix="원"
                  step="1000"
                />
              </Field>
              <Field
                label="정가"
                hint="넣으면 취소선과 할인율이 같이 보입니다. 없으면 비워 두세요."
              >
                <NumberInput
                  value={listPrice}
                  onChange={setListPrice}
                  placeholder="비워 두면 할인 표시 없음"
                  suffix="원"
                  step="1000"
                />
              </Field>
            </div>

            <Toggle
              checked={freeShipping}
              onChange={setFreeShipping}
              label="무료배송"
              hint={`${krw(sellingRules.freeShippingOver)} 이상이면 자동으로 켜집니다`}
            />

            <Field label="판매 상태" required>
              <Select value={status} onChange={setStatus} options={statusOptions} />
            </Field>
          </FormSection>
        </div>

        {/* 오른쪽 — 미리보기, 계산 결과, 등록 버튼 */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-[13px] font-bold tracking-wide text-ink-muted">
            목록에 이렇게 보입니다
          </h2>
          <div className="mt-3 max-w-[240px]">
            <LotCard lot={preview} />
          </div>

          <dl className="mt-6 space-y-2.5 rounded-card border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <dt className="text-[13px] text-ink-muted">개당 단가</dt>
              <dd className="text-[15px] font-bold tnum">
                {piecesNum && priceNum
                  ? krw(Math.round(priceNum / piecesNum))
                  : '—'}
              </dd>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between">
                <dt className="text-[13px] text-ink-muted">할인율</dt>
                <dd className="text-[15px] font-bold text-rust tnum">
                  {discount}%
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-line-soft pt-2.5">
              <dt className="text-[13px] text-ink-muted">구성 항목</dt>
              <dd className="text-[15px] font-bold tnum">
                {contentLines.length}개
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[13px] text-ink-muted">사진</dt>
              <dd className="text-[15px] font-bold tnum">{photos.length}장</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[13px] text-ink-muted">영상</dt>
              <dd className="text-[15px] font-bold tnum">
                {video ? mb(video.size) : '없음'}
              </dd>
            </div>
          </dl>

          {missing.length > 0 && (
            <div className="mt-3.5 rounded-card border border-line bg-white p-5">
              <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-rust">
                <Icon name="tag" className="size-4" />
                아직 안 채운 항목 {missing.length}개
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {missing.map((m) => (
                  <li
                    key={m}
                    className="rounded-full bg-rust/8 px-2.5 py-1 text-[12.5px] font-medium text-rust"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <ul className="mt-3.5 space-y-2">
              {warnings.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-2 rounded-card border border-rust/30 bg-rust/8 px-4 py-3 text-[13px] font-semibold leading-snug text-rust"
                >
                  <Icon
                    name="close"
                    className="mt-0.5 size-3.5 shrink-0"
                    strokeWidth={2.6}
                  />
                  {w}
                </li>
              ))}
            </ul>
          )}

          {submitError && (
            <p className="mt-3.5 rounded-card border border-rust/30 bg-rust/8 px-4 py-3.5 text-[13.5px] font-semibold leading-relaxed text-rust">
              등록하지 못했습니다. {submitError}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn btn-accent btn-lg mt-3.5 w-full disabled:cursor-not-allowed disabled:bg-ink-muted"
          >
            {submitting ? (
              '등록하고 있습니다...'
            ) : (
              <>
                <Icon name="plus" className="size-[18px]" strokeWidth={2.4} />
                묶음 등록하기
              </>
            )}
          </button>

          <p className="mt-2.5 text-center text-[12.5px] leading-relaxed text-ink-muted">
            {submitting
              ? '파일을 올리는 중입니다. 영상이 있으면 시간이 걸립니다. 창을 닫지 말아 주세요.'
              : '등록하면 바로 묶음 페이지로 넘어갑니다.'}
          </p>
        </div>
      </div>
    </div>
  )
}
