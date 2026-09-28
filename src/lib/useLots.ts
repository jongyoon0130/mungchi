import { useCallback, useEffect, useState } from 'react'
import type { Lot } from '../data/types'
import { store } from './store'

type Result<T> = {
  data: T
  loading: boolean
  error: string | null
  reload: () => void
}

export function useLots(): Result<Lot[]> {
  const [data, setData] = useState<Lot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    store
      .list()
      .then((lots) => {
        if (alive) {
          setData(lots)
          setError(null)
        }
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  return { data, loading, error, reload }
}

export function useLot(id: string | undefined): Result<Lot | null> {
  const [data, setData] = useState<Lot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    let alive = true
    setLoading(true)
    store
      .get(id)
      .then((lot) => {
        if (alive) {
          setData(lot)
          setError(null)
        }
      })
      .catch((e: Error) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  return { data, loading, error, reload }
}
