import { getJson } from '../http.js'

// Daftar episode dari Jikan (data MyAnimeList). 100 episode per halaman.
// Di endpoint ini mal_id = nomor episode.
export async function jikanEpisodes(malId, page = 1) {
  const r = await getJson(`https://api.jikan.moe/v4/anime/${malId}/episodes?page=${page}`)
  return {
    items: (r.data || []).map((e) => ({
      no: e.mal_id,
      title: e.title || '',
      aired: e.aired ? e.aired.slice(0, 10) : '',
      filler: !!e.filler,
    })),
    hasNext: !!r.pagination?.has_next_page,
  }
}
