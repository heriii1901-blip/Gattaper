import { useEffect, useRef, useState } from 'react'
import { getAnimeDetail, getEpisodes } from '../services/anime.js'

const EPS0 = { items: [], page: 0, hasNext: false, loading: false, from: '' }

// Muat detail anime (AniList) lalu daftar episodenya (Jikan, cadangan AniList)
export function useAnimeDetail(aid) {
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState('loading') // loading | done | error
  const [eps, setEps] = useState(EPS0)
  const run = useRef(0) // penanda "sesi" buka detail, biar pemuatan lama berhenti kalau pindah/keluar

  useEffect(() => {
    let live = true
    run.current++
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
      run.current++
    }
  }, [aid])

  // Muat 1 halaman berikutnya (tombol "Muat lagi")
  const more = async () => {
    if (!detail || eps.loading || !eps.hasNext) return
    setEps((e) => ({ ...e, loading: true }))
    const r = await getEpisodes(detail, eps.page + 1)
    setEps((e) => ({ items: [...e.items, ...r.items], page: e.page + 1, hasNext: r.hasNext, loading: false, from: r.from }))
  }

  // Muat semua halaman sisa (dipakai waktu urutan "Terbaru dulu", biar episode terakhir beneran muncul).
  // Dikasih jeda kecil antar halaman supaya gak kena batas request Jikan.
  const all = async () => {
    if (!detail || eps.loading || !eps.hasNext) return
    const token = run.current
    setEps((e) => ({ ...e, loading: true }))
    let page = eps.page
    let hasNext = true
    while (hasNext && run.current === token) {
      const r = await getEpisodes(detail, page + 1)
      if (run.current !== token) return
      page += 1
      hasNext = r.hasNext && r.items.length > 0
      setEps((e) => ({ items: [...e.items, ...r.items], page, hasNext, loading: hasNext, from: r.from }))
      if (hasNext) await new Promise((res) => setTimeout(res, 400))
    }
  }

  return { detail, status, eps, more, all }
}
