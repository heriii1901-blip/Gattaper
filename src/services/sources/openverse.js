import { getJson } from '../http.js'

export const openverse = {
  name: 'Openverse',

  async search(q) {
    const p = new URLSearchParams({ q, page_size: '24', mature: 'false' })
    const r = await getJson('https://api.openverse.org/v1/images/?' + p)
    return (r.results || []).map((i) => ({
      id: 'ov:' + i.id,
      type: 'foto',
      title: i.title || '',
      cover: i.thumbnail || i.url,
      url: i.foreign_landing_url || i.url,
      sub: i.creator || '',
      source: 'Openverse',
      ratio: i.width && i.height ? i.width / i.height : 1,
    }))
  },
}
