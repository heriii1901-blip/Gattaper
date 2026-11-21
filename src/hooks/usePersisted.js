import { useEffect, useState } from 'react'

// useState yang otomatis disimpan ke localStorage, jadi data gak hilang pas refresh / tutup tab / deploy ulang
export function usePersisted(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) return JSON.parse(raw)
    } catch {
      // rusak/diblok -> pakai nilai awal
    }
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // penyimpanan penuh/diblok, abaikan
    }
  }, [key, val])

  return [val, setVal]
}
