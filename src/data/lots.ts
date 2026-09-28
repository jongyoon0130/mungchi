import type { Lot } from './types'

/**
 * 묶음 값 계산. 데이터 자체는 `src/lib/store.ts`가 서버에서 가져온다.
 * 여기에는 가격을 다루는 순수 함수만 둔다.
 */

/** 개당 단가. 리셀러가 실제로 보는 기준 숫자다. */
export function pricePerPiece(lot: Lot): number {
  if (lot.pieces <= 0) return 0
  return Math.round(lot.price / lot.pieces)
}

/** 정가 대비 할인율(%). 정가가 없거나 더 싸면 0을 준다. */
export function discountRate(lot: Lot): number {
  if (!lot.listPrice || lot.listPrice <= lot.price) return 0
  return Math.round((1 - lot.price / lot.listPrice) * 100)
}

/** 살 수 있는 상태인지 */
export function isBuyable(lot: Lot): boolean {
  return lot.status === 'available'
}

/** 'L-001' 다음 번호를 만들어 준다 */
export function nextLotId(existing: Lot[]): string {
  const numbers = existing
    .map((l) => Number(l.id.replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n))
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1
  return `L-${String(next).padStart(3, '0')}`
}
