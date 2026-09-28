import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 라우터는 이동해도 스크롤을 건드리지 않는다. 목록에서 상세로 갔을 때
 * 페이지 중간부터 보이지 않도록 경로가 바뀌면 맨 위로 올린다.
 * 필터만 바뀌는 쿼리스트링 변경은 무시한다.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
