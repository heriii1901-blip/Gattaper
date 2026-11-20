// Ganti nama menu "Koleksi" di sini (mis. Etalase, Simpanan)
export const NAME_KOLEKSI = 'Koleksi'

export const CATS = [
  ['anime', 'Anime'],
  ['video', 'Video'],
  ['foto', 'Foto'],
]

// ts = waktu asli (ms). mnt(m) = "m menit yang lalu", cuma buat data contoh
const mnt = (m) => Date.now() - m * 60000

export const SEED = [
  { id: 1, t: 'anime', n: 'Frieren', seasons: [1, 2], ts: mnt(3 * 1440) },
  { id: 2, t: 'anime', n: 'Solo Leveling', seasons: [1], ts: mnt(2 * 1440) },
  { id: 3, t: 'anime', n: 'Kaiju No. 8', seasons: [1], ts: mnt(1440) },
  { id: 4, t: 'video', n: 'Edit Frieren AMV', h: 1.5, ts: mnt(8 * 1440) },
  { id: 5, t: 'video', n: 'Preset Glow', h: 1, ts: mnt(180) },
  { id: 6, t: 'video', n: 'Transisi Zoom', h: 1.8, ts: mnt(60) },
  { id: 7, t: 'video', n: 'Tutorial Keyframe', h: 1.2, ts: mnt(0) },
  { id: 8, t: 'foto', n: 'Wallpaper Frieren', c: 7, ts: mnt(1500) },
  { id: 9, t: 'foto', n: 'Fan Art Sung Jinwoo', c: 4, ts: mnt(200) },
  { id: 10, t: 'foto', n: 'Referensi Warna', c: 11, ts: mnt(70) },
]

// Warna cover sementara dari nama (nanti diganti gambar asli dari R2)
export const col = (n) => {
  let h = 0
  for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360
  return `linear-gradient(160deg,hsl(${h},55%,45%),hsl(${(h + 50) % 360},60%,28%))`
}

export const ago = (t) => {
  const m = Math.floor((Date.now() - t) / 60000)
  if (m < 1) return 'baru saja'
  if (m < 60) return `${m} menit lalu`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.floor(h / 24)
  if (d === 1) return 'kemarin'
  if (d < 7) return `${d} hari lalu`
  return `${Math.floor(d / 7)} minggu lalu`
}

// Menu navigasi bawah
export const NAV = [
  ['koleksi', NAME_KOLEKSI],
  ['riwayat', 'Riwayat'],
  ['cari', 'Cari'],
  ['profil', 'Profil'],
]

export const cap = (s) => s[0].toUpperCase() + s.slice(1)
