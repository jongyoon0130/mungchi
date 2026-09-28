const won = new Intl.NumberFormat('ko-KR')

/** 1120000 → "112만원". 큰 금액은 만 단위로 줄여야 카드에서 안 넘친다. */
export function manwon(value: number): string {
  const man = value / 10000
  if (Number.isInteger(man)) return `${won.format(man)}만원`
  return `${man.toFixed(1)}만원`
}

/** 14000 → "14,000원" */
export function krw(value: number): string {
  return `${won.format(value)}원`
}

export function comma(value: number): string {
  return won.format(value)
}

export const gradeLabel = {
  A: 'A급',
  B: 'B급',
  MIX: '믹스',
} as const

export const gradeNote = {
  A: '하자 없는 상급. 바로 판매 가능한 상태입니다.',
  B: '경미한 사용감이 있습니다. 세탁·수선 후 판매를 권합니다.',
  MIX: 'A급과 B급이 섞여 있습니다. 단가가 가장 낮습니다.',
} as const
