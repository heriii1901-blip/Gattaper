// Ganti nama menu "Koleksi" di sini (mis. Etalase, Simpanan)
export const NAME_KOLEKSI = 'Koleksi'

export const CATS = [
  ['anime', 'Anime'],
  ['video', 'Video'],
  ['foto', 'Foto'],
]

export const SEED = [
  { id: 1, t: 'anime', n: 'Frieren', seasons: [1, 2], ts: 5 },
  { id: 2, t: 'anime', n: 'Solo Leveling', seasons: [1], ts: 4 },
  { id: 3, t: 'anime', n: 'Kaiju No. 8', seasons: [1], ts: 3 },
  { id: 4, t: 'video', n: 'Edit Frieren AMV', h: 1.5, ts: 6 },
  { id: 5, t: 'video', n: 'Preset Glow', h: 1, ts: 2 },
  { id: 6, t: 'video', n: 'Transisi Zoom', h: 1.8, ts: 1 },
  { id: 7, t: 'video', n: 'Tutorial Keyframe', h: 1.2, ts: 0 },
  { id: 8, t: 'foto', n: 'Wallpaper Frieren', c: 7, ts: 3 },
  { id: 9, t: 'foto', n: 'Fan Art Sung Jinwoo', c: 4, ts: 2 },
  { id: 10, t: 'foto', n: 'Referensi Warna', c: 11, ts: 1 },
]

// Warna cover sementara dari nama (nanti diganti gambar asli dari R2)
export const col = (n) => {
  let h = 0
  for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360
  return `linear-gradient(160deg,hsl(${h},55%,45%),hsl(${(h + 50) % 360},60%,28%))`
}

export const ago = (t) =>
  ['baru saja', '1 jam lalu', '3 jam lalu', 'kemarin', '2 hari lalu', '3 hari lalu', 'minggu lalu'][t] || 'lama'
