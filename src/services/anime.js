import { cached } from './cache.js'
import { anilist } from './sources/anilist.js'
import { jikanEpisodes } from './sources/jikan.js'

// Detail anime: data utama dari AniList
export const getAnimeDetail = (aid) => cached('detail:' + aid, () => anilist.detail(aid))

// Cadangan kalau Jikan gagal/kosong: daftar bernomor dari jumlah episode AniList
const numbered = (d) => {
  const total = d.episodes || (d.nextEp ? d.nextEp.episode - 1 : 0)
  return Array.from({ length: total }, (_, i) => ({ no: i + 1, title: '', aired: '', filler: false }))
}

// Daftar episode: Jikan dulu (ada judul + tanggal), kalau gagal jatuh ke daftar bernomor.
// Nggak pernah throw, jadi halaman detail tetap tampil walau sumber episode bermasalah.
export async function getEpisodes(d, page = 1) {
  if (d.malId) {
    try {
      const r = await cached(`eps:${d.malId}:${page}`, () => jikanEpisodes(d.malId, page))
      if (r.items.length) return { ...r, from: 'Jikan' }
    } catch {
      // lanjut ke cadangan
    }
  }
  return { items: page === 1 ? numbered(d) : [], hasNext: false, from: 'AniList' }
}
