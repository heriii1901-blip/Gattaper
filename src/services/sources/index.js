import { anilist } from './anilist.js'
import { dailymotion } from './dailymotion.js'
import { wallhaven } from './wallhaven.js'
import { openverse } from './openverse.js'

// Daftar sumber per kategori. Nambah situs baru = bikin 1 file di folder ini, lalu daftarin di sini.
// Tiap sumber: { name, search(q) } dan mengembalikan item { id, type, title, cover, url, sub, source }
export const SOURCES = {
  anime: [anilist],
  video: [dailymotion],
  foto: [wallhaven, openverse],
}

// Gabung hasil beberapa sumber selang-seling biar tiap sumber kebagian tempat di atas
const mix = (lists) => {
  const out = []
  const max = Math.max(0, ...lists.map((l) => l.length))
  for (let i = 0; i < max; i++) lists.forEach((l) => l[i] && out.push(l[i]))
  return out
}

// Semua sumber di satu kategori dicari barengan. Satu sumber mati gak bikin yang lain ikut gagal.
export async function searchCategory(cat, q) {
  const list = SOURCES[cat]
  const res = await Promise.allSettled(list.map((s) => s.search(q)))
  const failed = list.filter((_, i) => res[i].status === 'rejected').map((s) => s.name)
  const items = mix(res.filter((r) => r.status === 'fulfilled').map((r) => r.value))
  if (!items.length && failed.length === list.length) throw new Error('Semua sumber gagal')
  return { items, failed }
}
