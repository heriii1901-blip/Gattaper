import { getJson } from '../http.js'

const dur = (s) => {
  if (!s) return ''
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`
}

export const dailymotion = {
  name: 'Dailymotion',

  async search(q) {
    const p = new URLSearchParams({
      search: q,
      fields: 'id,title,thumbnail_360_url,url,duration',
      limit: '24',
      family_filter: 'true',
    })
    const r = await getJson('https://api.dailymotion.com/videos?' + p)
    return (r.list || []).map((v) => ({
      id: 'dm:' + v.id,
      type: 'video',
      title: v.title,
      cover: v.thumbnail_360_url,
      url: v.url,
      sub: dur(v.duration),
      source: 'Dailymotion',
      ratio: 16 / 9,
    }))
  },
}
