import { useEffect, useState } from 'react'
import { CATS } from '../data/data.js'
import { searchCategory } from '../services/sources/index.js'

const state = (status) => Object.fromEntries(CATS.map(([k]) => [k, { status, items: [], failed: [] }]))

// Cari di semua kategori (anime, video, foto) sekaligus tiap `query` berubah.
// status per kategori: idle | loading | done | error
export function useSearch(query) {
  const [res, setRes] = useState(() => state('idle'))

  useEffect(() => {
    if (!query) {
      setRes(state('idle'))
      return
    }
    let live = true // hasil dari pencarian lama diabaikan
    setRes(state('loading'))
    CATS.forEach(([k]) => {
      searchCategory(k, query)
        .then((r) => live && setRes((s) => ({ ...s, [k]: { status: 'done', ...r } })))
        .catch(() => live && setRes((s) => ({ ...s, [k]: { status: 'error', items: [], failed: [] } })))
    })
    return () => {
      live = false
    }
  }, [query])

  return res
}
