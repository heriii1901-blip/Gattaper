import { getJson } from '../http.js'

// Tanpa API key, Wallhaven cuma ngasih konten SFW (purity=100)
export const wallhaven = {
  name: 'Wallhaven',

  async search(q) {
    const p = new URLSearchParams({ q, purity: '100', categories: '111', sorting: 'relevance' })
    const r = await getJson('https://wallhaven.cc/api/v1/search?' + p)
    return (r.data || []).map((w) => ({
      id: 'wh:' + w.id,
      type: 'foto',
      title: '',
      cover: w.thumbs?.large || w.thumbs?.small,
      url: w.url,
      sub: w.resolution,
      source: 'Wallhaven',
      ratio: w.dimension_x && w.dimension_y ? w.dimension_x / w.dimension_y : 1.5,
    }))
  },
}
