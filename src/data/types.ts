/** 의류 상태 등급. 국내 구제 도매에서 통용되는 A/B/믹스 구분을 따랐다. */
export type Grade = 'A' | 'B' | 'MIX'

export type CategoryId =
  | 'outer'
  | 'denim'
  | 'knit'
  | 'tee'
  | 'track'
  | 'shirt'
  | 'dress'
  | 'acc'

/** 대분류. 상세 페이지 맨 아래 '부문'으로 보인다 */
export type DepartmentId = 'men' | 'women' | 'unisex' | 'kids'

export type Season = '사계절' | '봄·가을' | '여름' | '겨울'

export interface Category {
  id: CategoryId
  name: string
  blurb: string
}

export interface Department {
  id: DepartmentId
  name: string
}

/**
 * 판매 상태.
 * - available: 판매 중. 바로 살 수 있다
 * - reserved: 예약됨. 결제·입금 확인 중
 * - sold: 판매 완료
 */
export type LotStatus = 'available' | 'reserved' | 'sold'

/**
 * 판매하는 묶음 하나.
 *
 * 경매가 아니라 올린 사람이 정한 값에 파는 방식이다. 사는 쪽은 그 값을 보고
 * 살지 말지만 결정한다. 값을 채우는 방법은 `/register` 등록 양식에 있다.
 */
export interface Lot {
  /** 묶음 번호. 'L-001' 처럼 순서대로 매긴다 */
  id: string
  title: string
  /** 목록 카드에 들어가는 한 줄 소개 */
  summary: string
  department: DepartmentId
  category: CategoryId
  grade: Grade
  season: Season

  /** 묶음에 들어 있는 장수 */
  pieces: number
  /** 총 중량(kg). 배송비 계산과 정보 공개용 */
  weightKg: number
  /** 매입처. 예: '일본 오사카', '국내 지역 창고' */
  origin: string

  /** 구성 내역. '리바이스 501 레귤러 16장' 처럼 한 줄씩 */
  contents: string[]
  /** 상태 특이사항. 하자나 수선 필요 여부를 솔직하게 적는다 */
  conditionNotes: string

  /** 사진 URL. 첫 장이 대표 사진이 된다 */
  photos: string[]
  /**
   * 묶음을 넘겨 보여주는 영상 URL. 없으면 비어 있다.
   * 상세 페이지에서 사진 다음 칸에 재생 버튼으로 뜬다.
   */
  video?: string

  /** 판매가(원). 묶음 전체 가격이다 */
  price: number
  /**
   * 정가(원). 넣으면 할인율과 함께 취소선으로 같이 보인다.
   * 비워 두면 할인 표시 없이 판매가만 나온다.
   */
  listPrice?: number
  /** 무료배송 여부 */
  freeShipping: boolean

  status: LotStatus
  /** 등록 시각 (ISO 8601). 최신순 정렬에 쓴다 */
  listedAt: string
}

/**
 * 등록 양식이 만들어 내는 값. 저장된 뒤에 붙는 것들(사진·영상 URL)은
 * 빠져 있다. 파일은 File 객체로 따로 넘긴다.
 */
export type LotInput = Omit<Lot, 'photos' | 'video'>
