import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 경로가 바뀌면 맨 위로. 해시(#products 등)가 있으면 그 섹션으로 맞춘다.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const go = () => document.getElementById(id)?.scrollIntoView()
      go()
      const t = window.setTimeout(go, 50)
      return () => window.clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
