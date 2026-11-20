import { useEffect, useState } from 'react'
import { getAnimeDetail, getEpisodes } from '../services/anime.js'

const EPS0 = { items: [], page: 0, hasNext: false, loading: false, from: '' }

// Muat detail anime (AniList) lalu daftar episodenya (Jikan, cadangan AniList)
export function useAnimeDetail(aid) {
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState('loading') // loading | done | error
  const [eps, setEps] = useState(EPS0)

  useEffect(() => {
    let live = true
    setDetail(null)
    setStatus('loading')
    setEps(EPS0)
    getAnimeDetail(aid)
      .then(async (d) => {
        if (!live) return
        setDetail(d)
        setStatus('done')
        setEps({ ...EPS0, loading: true })
        const r = await getEpisodes(d, 1)
        if (live) setEps({ items: r.items, page: 1, hasNext: r.hasNext, loading: false, from: r.from })
      })
      .catch(() => live && setStatus('error'))
    return () => {
      live = false
    }
  }, [aid])

  const more = async () => {
    if (!detail || eps.loading || !eps.hasNext) return
    setEps((e) => ({ ...e, loading: true }))
    const r = await getEpisodes(detail, eps.page + 1)
    setEps((e) => ({ items: [...e.items, ...r.items], page: e.page + 1, hasNext: r.hasNext, loading: false, from: r.from }))
  }

  return { detail, status, eps, more }
}
