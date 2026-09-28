import type { Category, Department } from './types'

/** 대분류. 상세 페이지의 '부문' 줄에 쓰인다 */
export const departments: Department[] = [
  { id: 'men', name: '남성복' },
  { id: 'women', name: '여성복' },
  { id: 'unisex', name: '공용' },
  { id: 'kids', name: '아동복' },
]

export const departmentMap = new Map(departments.map((d) => [d.id, d]))

/** 등록·이후 공개 필터용 카테고리. 지금은 공개 탐색에 쓰지 않는다. */
export const categories: Category[] = [
  { id: 'outer', name: '아우터', blurb: '항공점퍼 · 코치자켓 · 플리스' },
  { id: 'denim', name: '데님', blurb: '501 · 와이드 · 부츠컷' },
  { id: 'knit', name: '니트 · 스웨터', blurb: '가디건 · 아가일 · 케이블' },
  { id: 'tee', name: '티셔츠 · 후디', blurb: '프린팅 티 · 칼리지 후드' },
  { id: 'track', name: '트랙수트', blurb: 'Y2K 저지 · 바람막이' },
  { id: 'shirt', name: '셔츠 · 블라우스', blurb: '체크 · 옥스퍼드 · 실크' },
  { id: 'dress', name: '원피스 · 스커트', blurb: '플로럴 · 테니스 스커트' },
  { id: 'acc', name: '가방 · 모자', blurb: '캡 · 토트 · 벨트' },
]

export const categoryMap = new Map(categories.map((c) => [c.id, c]))
