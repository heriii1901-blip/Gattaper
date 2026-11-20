// Cache sederhana di memori: panggilan yang sama (mis. buka detail anime lagi) gak nembak API dua kali.
// Kalau gagal, cache-nya dibuang supaya bisa dicoba ulang.
const store = new Map()

export function cached(key, fn) {
  if (store.has(key)) return store.get(key)
  const p = fn().catch((e) => {
    store.delete(key)
    throw e
  })
  store.set(key, p)
  return p
}
