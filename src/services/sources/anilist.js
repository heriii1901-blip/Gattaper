import { getJson } from '../http.js'

const ENDPOINT = 'https://graphql.anilist.co'

const gql = async (query, variables) => {
  const res = await getJson(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (res.errors?.length) throw new Error(res.errors[0].message)
  return res.data
}

const FORMAT = { TV: 'TV', TV_SHORT: 'TV Short', MOVIE: 'Movie', SPECIAL: 'Special', OVA: 'OVA', ONA: 'ONA', MUSIC: 'Musik' }

const SOURCE = {
  ORIGINAL: 'Original', MANGA: 'Manga', LIGHT_NOVEL: 'Light novel', VISUAL_NOVEL: 'Visual novel',
  VIDEO_GAME: 'Game', GAME: 'Game', OTHER: 'Lainnya', NOVEL: 'Novel', DOUJINSHI: 'Doujinshi',
  ANIME: 'Anime', WEB_NOVEL: 'Web novel', LIVE_ACTION: 'Live action', COMIC: 'Komik',
  MULTIMEDIA_PROJECT: 'Proyek multimedia', PICTURE_BOOK: 'Buku bergambar',
}

const STATUS = {
  FINISHED: 'Selesai', RELEASING: 'Sedang tayang', NOT_YET_RELEASED: 'Belum tayang',
  CANCELLED: 'Dibatalkan', HIATUS: 'Hiatus',
}

// Deskripsi AniList berisi tag HTML (<br>, <i>, dll). DOMParser aman: dokumennya mati, gak ada script/gambar yang jalan.
const toText = (html = '') =>
  (new DOMParser().parseFromString(html.replace(/<br\s*\/?>/gi, '\n'), 'text/html').body.textContent || '').trim()

const SEARCH = `query ($q: String, $n: Int) {
  Page(perPage: $n) {
    media(search: $q, type: ANIME, isAdult: false, sort: SEARCH_MATCH) {
      id idMal
      title { romaji english }
      coverImage { large }
      format seasonYear
    }
  }
}`

const DETAIL = `query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id idMal
    title { romaji english native }
    coverImage { extraLarge large }
    description(asHtml: false)
    genres format status episodes season seasonYear source averageScore
    studios(isMain: true) { nodes { name } }
    nextAiringEpisode { episode airingAt }
    externalLinks { site url type }
  }
}`

export const anilist = {
  name: 'AniList',

  async search(q) {
    const d = await gql(SEARCH, { q, n: 24 })
    return d.Page.media.map((m) => ({
      id: 'anilist:' + m.id,
      aid: m.id,
      type: 'anime',
      title: m.title.romaji || m.title.english,
      cover: m.coverImage?.large,
      sub: [FORMAT[m.format], m.seasonYear].filter(Boolean).join(' • '),
      source: 'AniList',
    }))
  },

  async detail(id) {
    const { Media: m } = await gql(DETAIL, { id })
    const alt = m.title.english && m.title.english !== m.title.romaji ? m.title.english : m.title.native
    return {
      aid: m.id,
      malId: m.idMal,
      title: m.title.romaji || m.title.english,
      altTitle: alt || '',
      cover: m.coverImage?.extraLarge || m.coverImage?.large,
      description: toText(m.description),
      genres: m.genres || [],
      studios: (m.studios?.nodes || []).map((s) => s.name),
      source: SOURCE[m.source] || '',
      status: STATUS[m.status] || '',
      format: FORMAT[m.format] || '',
      year: m.seasonYear || '',
      episodes: m.episodes || null,
      score: m.averageScore || null,
      nextEp: m.nextAiringEpisode || null,
      streams: (m.externalLinks || []).filter((l) => l.type === 'STREAMING').map((l) => ({ site: l.site, url: l.url })),
    }
  },
}
